# 快速入门指南

## 🚀 5分钟快速上手

### 1. 编译项目
```bash
cd pansou
go build -o pansou.exe .
```

### 2. 启动服务
```bash
./pansou.exe
```

服务将在 `http://localhost:8888` 启动

### 3. 测试搜索API
```bash
curl -X POST http://localhost:8888/api/search \
  -H "Content-Type: application/json" \
  -d '{"kw": "七王国的骑士", "cloud_types": ["quark"]}'
```

### 4. 查看验证结果

返回的JSON中，每个链接会包含验证状态：

```json
{
  "links": [
    {
      "type": "quark",
      "url": "https://pan.quark.cn/s/xxxxx",
      "valid": true,
      "valid_status": "valid",
      "checked_at": "2026-02-02T16:30:00Z"
    }
  ]
}
```

## 📖 验证状态说明

| valid | valid_status | 说明 |
|-------|--------------|------|
| true | valid | 链接有效 ✅ |
| false | invalid | 链接失效 ❌ |
| - | unknown | 未验证 ⚠️ |

## 🔧 配置选项

### 启用/禁用验证

编辑 `pansou/service/search_service.go`:

```go
// 在 NewSearchService 函数中
verificationEnabled: true,  // true=启用, false=禁用
```

### 修改验证策略

编辑 `pansou/service/verifier/verifier.go`:

```go
// 在 DefaultConfig 中
var DefaultConfig = VerificationConfig{
    Strategy:      MarkStrategy,  // 或 FilterStrategy, DemoteStrategy
    EnableCache:   true,
    CacheTTL:      24,            // 缓存小时数
    MaxConcurrent: 5,             // 并发数
}
```

## 🧪 运行测试

```bash
# 编译测试程序
go build -o test_verifier.exe test_verification.go

# 运行测试
./test_verifier.exe
```

## 📚 更多文档

- [完整开发总结](DEVELOPMENT_SUMMARY.md)
- [验证模块文档](service/verifier/README.md)

## ❓ 常见问题

### Q: 验证功能不工作？
A: 检查日志输出，确认验证是否启用：
```
[链接验证] 开始验证 N 个夸克链接...
```

### Q: 大量链接显示"invalid"？
A: 可能是网络问题或限流，检查：
- 网络连接是否正常
- 请求是否过于频繁
- 夸克服务器是否可访问

### Q: 如何提高验证准确性？
A: 可以实现夸克API验证（参考DEVELOPMENT_SUMMARY.md）

## 🎯 下一步

1. 运行测试程序验证功能
2. 使用真实搜索请求测试
3. 根据需要调整配置
4. 集成前端界面（盘小子）

## 📞 获取帮助

如有问题，请查看：
- [故障排查](service/verifier/README.md#故障排查)
- [GitHub Issues](https://github.com/fish2018/pansou/issues)
