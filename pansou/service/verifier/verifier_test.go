package verifier

import (
	"fmt"
	"time"
)

// TestQuarkVerifier 测试夸克验证器
func TestQuarkVerifier() {
	fmt.Println("=== 夸克链接验证器测试 ===\n")

	// 1. 创建验证服务
	config := DefaultConfig
	service := NewVerificationService(config)

	// 2. 测试用例
	testCases := []struct {
		url         string
		description string
	}{
		{
			url:         "https://pan.quark.cn/s/b96913e0824a",
			description: "有效的夸克分享链接（来自用户需求）",
		},
		{
			url:         "https://pan.baidu.com/s/123456",
			description: "非夸克链接（百度网盘）",
		},
		{
			url:         "https://example.com/notfound",
			description: "无效URL",
		},
	}

	// 3. 执行测试
	for i, tc := range testCases {
		fmt.Printf("测试 %d: %s\n", i+1, tc.description)
		fmt.Printf("URL: %s\n", tc.url)

		result, err := service.VerifyLink(tc.url)
		if err != nil {
			fmt.Printf("❌ 错误: %v\n\n", err)
			continue
		}

		fmt.Printf("结果:\n")
		fmt.Printf("  - 有效: %v\n", result.Valid)
		fmt.Printf("  - 状态: %s\n", result.Message)
		fmt.Printf("  - 状态码: %d\n", result.StatusCode)
		fmt.Printf("  - 验证时间: %s\n\n", result.CheckedAt.Format("2006-01-02 15:04:05"))
	}

	// 4. 显示缓存统计
	stats := service.GetStats()
	fmt.Printf("缓存统计: %s\n", stats.String())
}

// TestBatchVerification 测试批量验证
func TestBatchVerification() {
	fmt.Println("\n=== 批量验证测试 ===\n")

	service := NewVerificationService(DefaultConfig)

	urls := []string{
		"https://pan.quark.cn/s/b96913e0824a",
		"https://pan.quark.cn/s/xxxxxx",
		"https://pan.baidu.com/s/123456",
	}

	fmt.Printf("批量验证 %d 个链接...\n\n", len(urls))

	results := service.VerifyBatch(urls)

	for i, result := range results {
		fmt.Printf("%d. %s\n", i+1, result.URL)
		fmt.Printf("   有效: %v, 状态: %s\n\n", result.Valid, result.Message)
	}

	// 等待所有异步验证完成
	time.Sleep(5 * time.Second)

	// 再次显示缓存统计
	stats := service.GetStats()
	fmt.Printf("最终缓存统计: %s\n", stats.String())
}

// TestRateLimiter 测试限流器
func TestRateLimiter() {
	fmt.Println("\n=== 限流器测试 ===\n")

	limiter := NewRateLimiter(5, 10*time.Second)

	testURL := "https://pan.quark.cn/s/test123"

	fmt.Printf("测试限流器 (限制: 5次/10秒)\n\n")

	for i := 1; i <= 8; i++ {
		allowed := limiter.Allow(testURL)
		current, remaining := limiter.GetStats(testURL)

		fmt.Printf("请求 %d: 允许=%v, 当前=%d, 剩余=%d\n",
			i, allowed, current, remaining)

		if !allowed {
			fmt.Printf("  → 请求被限流！\n")
		}
		time.Sleep(500 * time.Millisecond)
	}

	fmt.Println("\n限流器测试完成")
}

// RunAllTests 运行所有测试
func RunAllTests() {
	TestQuarkVerifier()
	TestBatchVerification()
	TestRateLimiter()

	fmt.Println("\n=== 所有测试完成 ===")
}
