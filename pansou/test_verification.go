package main

import (
	"fmt"
	"pansou/service/verifier"
)

func main() {
	fmt.Println("=== 夸克链接验证功能测试 ===\n")

	// 创建验证服务
	service := verifier.NewVerificationService(verifier.DefaultConfig)

	// 测试用例1: 验证单个链接
	fmt.Println("【测试1】验证单个夸克链接")
	testURL := "https://pan.quark.cn/s/b96913e0824a"
	result, err := service.VerifyLink(testURL)

	if err != nil {
		fmt.Printf("❌ 验证失败: %v\n\n", err)
	} else {
		fmt.Printf("✅ 验证成功:\n")
		fmt.Printf("   URL: %s\n", result.URL)
		fmt.Printf("   有效: %v\n", result.Valid)
		fmt.Printf("   状态: %s\n", result.Message)
		fmt.Printf("   状态码: %d\n", result.StatusCode)
		fmt.Printf("   验证时间: %s\n\n", result.CheckedAt.Format("2006-01-02 15:04:05"))
	}

	// 测试用例2: 批量验证
	fmt.Println("【测试2】批量验证链接")
	urls := []string{
		"https://pan.quark.cn/s/b96913e0824a",
		"https://pan.quark.cn/s/xxxxxx",
		"https://pan.baidu.com/s/123456",
	}

	results := service.VerifyBatch(urls)
	fmt.Printf("批量验证 %d 个链接:\n", len(results))
	for i, r := range results {
		fmt.Printf("  %d. %s\n", i+1, r.URL)
		fmt.Printf("     有效: %v, 状态: %s\n", r.Valid, r.Message)
	}

	// 显示统计信息
	stats := service.GetStats()
	fmt.Printf("\n【统计信息】%s\n\n", stats.String())

	fmt.Println("=== 测试完成 ===")
}
