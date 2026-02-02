package verifier

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

// QuarkVerifier 夸克网盘链接验证器
type QuarkVerifier struct {
	client *http.Client
	cache  VerificationCache
}

// VerificationResult 验证结果
type VerificationResult struct {
	URL        string    `json:"url"`
	Valid      bool      `json:"valid"`
	CheckedAt  time.Time `json:"checked_at"`
	StatusCode int       `json:"status_code"`
	Message    string    `json:"message"`
}

// NewQuarkVerifier 创建夸克验证器
func NewQuarkVerifier(cache VerificationCache) *QuarkVerifier {
	return &QuarkVerifier{
		client: &http.Client{
			Timeout: 10 * time.Second,
			Transport: &headerTransport{
				headers: map[string]string{
					"User-Agent":      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
					"Accept":          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
					"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
					"Connection":      "keep-alive",
				},
			},
		},
		cache: cache,
	}
}

// headerTransport 自定义HTTP Transport，用于设置请求头
type headerTransport struct {
	headers map[string]string
	base    http.RoundTripper
}

func (t *headerTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	// 设置自定义请求头
	for key, value := range t.headers {
		req.Header.Set(key, value)
	}

	// 使用默认Transport
	if t.base == nil {
		return http.DefaultTransport.RoundTrip(req)
	}
	return t.base.RoundTrip(req)
}

// VerifyLink 验证单个夸克链接
func (qv *QuarkVerifier) VerifyLink(linkURL string) (*VerificationResult, error) {
	// 1. 检查缓存
	if cached := qv.cache.Get(linkURL); cached != nil {
		// 缓存有效期24小时
		if time.Since(cached.CheckedAt) < 24*time.Hour {
			return cached, nil
		}
	}

	// 2. 验证是否为夸克链接
	if !qv.isQuarkLink(linkURL) {
		return &VerificationResult{
			URL:       linkURL,
			Valid:     false,
			CheckedAt: time.Now(),
			Message:   "非夸克网盘链接",
		}, nil
	}

	// 3. 发送HEAD请求（不下载内容）
	req, err := http.NewRequest("HEAD", linkURL, nil)
	if err != nil {
		return &VerificationResult{
			URL:       linkURL,
			Valid:     false,
			CheckedAt: time.Now(),
			Message:   "请求构造失败",
		}, nil
	}

	resp, err := qv.client.Do(req)
	if err != nil {
		return &VerificationResult{
			URL:       linkURL,
			Valid:     false,
			CheckedAt: time.Now(),
			Message:   "网络请求失败",
		}, nil
	}
	defer resp.Body.Close() // 安全：err检查在defer之前

	// 4. 分析响应状态码
	result := &VerificationResult{
		URL:        linkURL,
		Valid:      qv.isValidStatusCode(resp.StatusCode),
		CheckedAt:  time.Now(),
		StatusCode: resp.StatusCode,
		Message:    qv.getStatusMessage(resp.StatusCode),
	}

	// 5. 缓存结果
	qv.cache.Set(linkURL, result, 24*time.Hour)

	return result, nil
}

// isQuarkLink 检查是否为夸克网盘链接
func (qv *QuarkVerifier) isQuarkLink(rawURL string) bool {
	// 解析URL
	u, err := url.Parse(rawURL)
	if err != nil {
		return false
	}

	// 检查域名
	quarkDomains := []string{
		"pan.quark.cn",
		"quark.cn",
	}

	for _, domain := range quarkDomains {
		if u.Host == domain || strings.HasSuffix(u.Host, "."+domain) {
			return true
		}
	}
	return false
}

// isValidStatusCode 判断状态码是否有效
func (qv *QuarkVerifier) isValidStatusCode(statusCode int) bool {
	// 只接受2xx状态码（200-299），3xx重定向可能指向错误页
	return (statusCode >= 200 && statusCode < 300)
}

// getStatusMessage 获取状态描述
func (qv *QuarkVerifier) getStatusMessage(code int) string {
	switch {
	case code >= 200 && code < 300:
		return "链接有效"
	case code >= 300 && code < 400:
		return "链接重定向有效"
	case code == 404:
		return "分享已失效(404)"
	case code == 403:
		return "无访问权限(403)"
	case code == 410:
		return "资源已删除(410)"
	case code >= 500:
		return "服务器错误"
	default:
		return fmt.Sprintf("未知状态(%d)", code)
	}
}

// VerifyBatch 批量验证链接（带限流）
func (qv *QuarkVerifier) VerifyBatch(urls []string) []*VerificationResult {
	results := make([]*VerificationResult, len(urls))
	var wg sync.WaitGroup
	semaphore := make(chan struct{}, 5) // 最多5个并发

	for i, u := range urls {
		wg.Add(1)
		semaphore <- struct{}{}
		go func(idx int, url string) {
			defer wg.Done()
			defer func() { <-semaphore }()

			result, err := qv.VerifyLink(url)
			if err != nil {
				log.Printf("[QuarkVerifier] 验证失败: %s, 错误: %v", url, err)
				result = &VerificationResult{
					URL:       url,
					Valid:     false,
					CheckedAt: time.Now(),
					Message:   "验证异常",
				}
			}
			results[idx] = result
			time.Sleep(500 * time.Millisecond) // 避免请求过快
		}(i, u)
	}

	wg.Wait() // 等待所有goroutine完成
	return results
}

// SetCache 设置缓存实例
func (qv *QuarkVerifier) SetCache(cache VerificationCache) {
	qv.cache = cache
}
