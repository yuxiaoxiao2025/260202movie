package verifier

import (
	"sync"
	"time"
)

// RateLimiter 限流器
type RateLimiter struct {
	mu          sync.Mutex
	requestLog  map[string][]time.Time
	maxRequests int
	window      time.Duration
}

// NewRateLimiter 创建限流器
func NewRateLimiter(maxRequests int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		requestLog:  make(map[string][]time.Time),
		maxRequests: maxRequests,
		window:      window,
	}
	// 启动清理协程
	go rl.cleanup()
	return rl
}

// Allow 检查是否允许请求
func (rl *RateLimiter) Allow(key string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	log := rl.requestLog[key]

	// 清理过期的请求记录
	var valid []time.Time
	for _, t := range log {
		if now.Sub(t) < rl.window {
			valid = append(valid, t)
		}
	}

	if len(valid) >= rl.maxRequests {
		return false // 超过限制
	}

	// 记录本次请求
	valid = append(valid, now)
	rl.requestLog[key] = valid
	return true
}

// cleanup 定期清理过期记录
func (rl *RateLimiter) cleanup() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		for key, log := range rl.requestLog {
			var valid []time.Time
			now := time.Now()
			for _, t := range log {
				if now.Sub(t) < rl.window {
					valid = append(valid, t)
				}
			}
			if len(valid) == 0 {
				delete(rl.requestLog, key)
			} else {
				rl.requestLog[key] = valid
			}
		}
		rl.mu.Unlock()
	}
}

// Reset 重置限流器
func (rl *RateLimiter) Reset(key string) {
	rl.mu.Lock()
	defer rl.mu.Unlock()
	delete(rl.requestLog, key)
}

// GetStats 获取限流统计
func (rl *RateLimiter) GetStats(key string) (current int, remaining int) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	log := rl.requestLog[key]

	var valid []time.Time
	for _, t := range log {
		if now.Sub(t) < rl.window {
			valid = append(valid, t)
		}
	}

	current = len(valid)
	remaining = rl.maxRequests - current
	if remaining < 0 {
		remaining = 0
	}

	return
}
