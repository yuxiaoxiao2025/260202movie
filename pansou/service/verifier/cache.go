package verifier

import (
	"sync"
	"time"
)

// VerificationCache 验证缓存接口
type VerificationCache interface {
	Get(key string) *VerificationResult
	Set(key string, result *VerificationResult, ttl time.Duration)
	Delete(key string)
	Clear()
}

// MemoryCache 内存缓存实现
type MemoryCache struct {
	mu    sync.RWMutex
	store map[string]*CacheEntry
}

// CacheEntry 缓存条目
type CacheEntry struct {
	Result   *VerificationResult
	ExpireAt time.Time
}

// NewMemoryCache 创建内存缓存
func NewMemoryCache() *MemoryCache {
	cache := &MemoryCache{
		store: make(map[string]*CacheEntry),
	}
	// 启动清理协程
	go cache.startCleanup()
	return cache
}

// Get 获取缓存
func (mc *MemoryCache) Get(key string) *VerificationResult {
	mc.mu.RLock()
	defer mc.mu.RUnlock()

	entry, exists := mc.store[key]
	if !exists || time.Now().After(entry.ExpireAt) {
		return nil
	}
	return entry.Result
}

// Set 设置缓存
func (mc *MemoryCache) Set(key string, result *VerificationResult, ttl time.Duration) {
	mc.mu.Lock()
	defer mc.mu.Unlock()

	mc.store[key] = &CacheEntry{
		Result:   result,
		ExpireAt: time.Now().Add(ttl),
	}
}

// Delete 删除缓存
func (mc *MemoryCache) Delete(key string) {
	mc.mu.Lock()
	defer mc.mu.Unlock()

	delete(mc.store, key)
}

// Clear 清空所有缓存
func (mc *MemoryCache) Clear() {
	mc.mu.Lock()
	defer mc.mu.Unlock()

	mc.store = make(map[string]*CacheEntry)
}

// startCleanup 定期清理过期缓存
func (mc *MemoryCache) startCleanup() {
	ticker := time.NewTicker(10 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		mc.cleanup()
	}
}

// cleanup 清理过期缓存条目
func (mc *MemoryCache) cleanup() {
	mc.mu.Lock()
	defer mc.mu.Unlock()

	now := time.Now()
	for key, entry := range mc.store {
		if now.After(entry.ExpireAt) {
			delete(mc.store, key)
		}
	}
}

// Stats 获取缓存统计信息
func (mc *MemoryCache) Stats() CacheStats {
	mc.mu.RLock()
	defer mc.mu.RUnlock()

	validCount := 0
	now := time.Now()
	for _, entry := range mc.store {
		if now.Before(entry.ExpireAt) {
			validCount++
		}
	}

	return CacheStats{
		TotalEntries: len(mc.store),
		ValidEntries: validCount,
	}
}

// CacheStats 缓存统计信息
type CacheStats struct {
	TotalEntries int
	ValidEntries int
}
