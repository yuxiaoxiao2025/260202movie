package verifier

// VerificationStrategy 验证策略
type VerificationStrategy string

const (
	// FilterStrategy 过滤掉无效链接
	FilterStrategy VerificationStrategy = "filter"
	// DemoteStrategy 降权但保留
	DemoteStrategy VerificationStrategy = "demote"
	// MarkStrategy 仅标记状态
	MarkStrategy VerificationStrategy = "mark"
)

// VerificationConfig 验证配置
type VerificationConfig struct {
	Strategy    VerificationStrategy `json:"strategy"`
	EnableCache bool                 `json:"enable_cache"`
	CacheTTL    int                  `json:"cache_ttl"` // 小时
	MaxConcurrent int                `json:"max_concurrent"`
}

// DefaultConfig 默认配置
var DefaultConfig = VerificationConfig{
	Strategy:      MarkStrategy,
	EnableCache:   true,
	CacheTTL:      24,
	MaxConcurrent: 5,
}
