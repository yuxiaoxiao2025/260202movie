package verifier

import (
	"fmt"
	"log"
	"time"
)

// VerificationService 验证服务
type VerificationService struct {
	verifier    *QuarkVerifier
	cache       VerificationCache
	rateLimiter *RateLimiter
	config      VerificationConfig
}

// NewVerificationService 创建验证服务
func NewVerificationService(config VerificationConfig) *VerificationService {
	cache := NewMemoryCache()
	verifier := NewQuarkVerifier(cache)

	// 限流器: 每分钟最多60个请求
	rateLimiter := NewRateLimiter(60, 1*time.Minute)

	return &VerificationService{
		verifier:    verifier,
		cache:       cache,
		rateLimiter: rateLimiter,
		config:      config,
	}
}

// VerifyLink 验证单个链接
func (vs *VerificationService) VerifyLink(url string) (*VerificationResult, error) {
	// 检查限流（使用全局限流key）
	if !vs.rateLimiter.Allow("global") {
		log.Printf("[VerificationService] 请求过于频繁，跳过验证: %s", url)
		return &VerificationResult{
			URL:       url,
			Valid:     false,
			CheckedAt: vs.getCurrentTime(),
			Message:   "请求限流",
		}, nil
	}

	// 执行验证
	result, err := vs.verifier.VerifyLink(url)
	if err != nil {
		log.Printf("[VerificationService] 验证失败: %s, 错误: %v", url, err)
		return nil, err
	}

	log.Printf("[VerificationService] 验证完成: %s, 有效: %v, 状态: %s",
		url, result.Valid, result.Message)

	return result, nil
}

// VerifyBatch 批量验证链接
func (vs *VerificationService) VerifyBatch(urls []string) []*VerificationResult {
	log.Printf("[VerificationService] 开始批量验证: %d 个链接", len(urls))

	results := vs.verifier.VerifyBatch(urls)

	validCount := 0
	for _, r := range results {
		if r.Valid {
			validCount++
		}
	}

	log.Printf("[VerificationService] 批量验证完成: 有效 %d/%d", validCount, len(results))

	return results
}

// ProcessResults 根据策略处理验证结果
func (vs *VerificationService) ProcessResults(links []string, strategy VerificationStrategy) map[string]*VerificationResult {
	results := make(map[string]*VerificationResult)

	// 批量验证
	verificationResults := vs.VerifyBatch(links)

	// 存储结果
	for _, result := range verificationResults {
		results[result.URL] = result
	}

	return results
}

// GetCacheStats 获取缓存统计
func (vs *VerificationService) GetCacheStats() CacheStats {
	if mc, ok := vs.cache.(*MemoryCache); ok {
		return mc.Stats()
	}
	return CacheStats{}
}

// ClearCache 清空缓存
func (vs *VerificationService) ClearCache() {
	vs.cache.Clear()
	log.Println("[VerificationService] 缓存已清空")
}

// GetConfig 获取配置
func (vs *VerificationService) GetConfig() VerificationConfig {
	return vs.config
}

// UpdateConfig 更新配置
func (vs *VerificationService) UpdateConfig(config VerificationConfig) {
	vs.config = config
	log.Printf("[VerificationService] 配置已更新: 策略=%s", config.Strategy)
}

// getCurrentTime 获取当前时间（便于测试）
func (vs *VerificationService) getCurrentTime() time.Time {
	return time.Now()
}

// GetStats 获取服务统计信息
func (vs *VerificationService) GetStats() ServiceStats {
	cacheStats := vs.GetCacheStats()

	return ServiceStats{
		CacheTotal:   cacheStats.TotalEntries,
		CacheValid:   cacheStats.ValidEntries,
		Strategy:     vs.config.Strategy,
		CacheEnabled: vs.config.EnableCache,
	}
}

// ServiceStats 服务统计信息
type ServiceStats struct {
	CacheTotal   int
	CacheValid   int
	Strategy     VerificationStrategy
	CacheEnabled bool
}

// String 统计信息字符串化
func (ss ServiceStats) String() string {
	return fmt.Sprintf("缓存: %d/%d, 策略: %s",
		ss.CacheValid, ss.CacheTotal, ss.Strategy)
}
