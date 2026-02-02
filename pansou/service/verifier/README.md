# 夸克网盘链接验证模块

## 功能概述

本模块为PanSou搜索服务添加了夸克网盘链接有效性验证功能，确保返回给用户的链接都是真实有效的。

## 核心特性

- ✅ **HEAD请求验证**: 快速验证链接有效性，不下载内容
- ✅ **智能缓存**: 24小时缓存，避免重复验证
- ✅ **批量验证**: 支持并发验证多个链接（5并发）
- ✅ **限流保护**: 每分钟60次请求限制，避免被封禁
- ✅ **状态标记**: 使用mark策略，保留完整结果供用户判断

## 架构设计

```
搜索请求 → PanSou搜索服务 → 链接验证模块 → 缓存系统
                ↓                   ↓
          返回搜索结果        添加验证状态
```

## 使用方法

### 1. 启用验证功能

验证功能默认启用。如需控制，可以使用：

```go
// 获取搜索服务实例
searchService := service.NewSearchService(pluginManager)

// 禁用验证
searchService.SetVerificationEnabled(false)

// 启用验证
searchService.SetVerificationEnabled(true)
```

### 2. 配置验证策略

```go
// 创建自定义配置
config := verifier.VerificationConfig{
    Strategy:      verifier.MarkStrategy,  // 标记策略
    EnableCache:   true,                   // 启用缓存
    CacheTTL:      24,                     // 缓存24小时
    MaxConcurrent: 5,                      // 最多5个并发
}

// 使用自定义配置创建验证服务
verificationService := verifier.NewVerificationService(config)
```

### 3. 验证策略说明

#### Mark策略（默认）
- **行为**: 标记链接验证状态，不过滤
- **优点**: 保留完整结果，用户可自主判断
- **适用场景**: 日常搜索

#### Filter策略
- **行为**: 过滤掉无效链接
- **优点**: 结果更干净
- **适用场景**: 严格过滤场景

#### Demote策略
- **行为**: 将无效链接降权到末尾
- **优点**: 平衡结果完整性和排序
- **适用场景**: 需要优先展示有效链接

## API使用示例

### 搜索API

```bash
curl -X POST http://localhost:8888/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "kw": "七王国的骑士",
    "cloud_types": ["quark"]
  }'
```

### 响应格式

```json
{
  "total": 10,
  "results": [
    {
      "title": "七王国的骑士",
      "links": [
        {
          "type": "quark",
          "url": "https://pan.quark.cn/s/xxxxx",
          "password": "",
          "valid": true,
          "valid_status": "valid",
          "checked_at": "2026-02-02T16:30:00Z"
        }
      ]
    }
  ]
}
```

### 验证状态字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `valid` | boolean | 链接是否有效 |
| `valid_status` | string | 验证状态：valid/invalid/unknown |
| `checked_at` | datetime | 最后验证时间 |

## 性能优化

### 缓存机制

验证结果会缓存24小时，避免重复验证：

```go
// 获取缓存统计
stats := verificationService.GetCacheStats()
fmt.Printf("缓存: %d/%d", stats.CacheValid, stats.CacheTotal)
```

### 限流保护

每分钟最多60次验证请求，超过限制会自动跳过：

```go
// 检查是否允许验证
limiter := verifier.NewRateLimiter(60, 1*time.Minute)
allowed := limiter.Allow(url)
```

## 测试

### 运行测试程序

```bash
# 编译测试程序
cd pansou
go build -o test_verifier.exe test_verification.go

# 运行测试
./test_verifier.exe
```

### 单元测试

```bash
# 运行所有测试
go test ./service/verifier/...

# 运行特定测试
go test -run TestQuarkVerifier ./service/verifier/...
```

## 故障排查

### 验证功能不工作

1. 检查验证是否启用
```go
searchService.SetVerificationEnabled(true)
```

2. 查看日志输出
```
[链接验证] 开始验证 N 个夸克链接...
[链接验证] 验证完成: 有效 X/N
```

3. 检查缓存状态
```go
stats := verificationService.GetStats()
```

### 大量验证失败

可能原因：
- 网络问题
- 夸克服务器限流
- 链接确实已失效

解决方法：
- 检查网络连接
- 降低并发数量
- 增加请求间隔

## 配置建议

### 生产环境

```go
config := verifier.VerificationConfig{
    Strategy:      verifier.MarkStrategy,
    EnableCache:   true,
    CacheTTL:      24,
    MaxConcurrent: 3,  // 降低并发避免被封
}
```

### 开发环境

```go
config := verifier.VerificationConfig{
    Strategy:      verifier.MarkStrategy,
    EnableCache:   false,  // 禁用缓存方便测试
    CacheTTL:      1,
    MaxConcurrent: 5,
}
```

## 未来改进

- [ ] 支持夸克API验证（更高准确性）
- [ ] 添加用户反馈机制
- [ ] 实现验证结果持久化
- [ ] 支持代理池避免IP封禁
- [ ] 添加更多网盘类型验证

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
