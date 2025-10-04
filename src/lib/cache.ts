// Enhanced Cache Manager with Session Awareness
class CacheManager {
  private cache = new Map<string, { 
    data: unknown; 
    timestamp: number; 
    ttl: number;
    sessionId?: string;
    userType?: 'admin' | 'client';
  }>();

  set(key: string, data: unknown, ttl: number = 5 * 60 * 1000, sessionId?: string, userType?: 'admin' | 'client') {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      sessionId,
      userType,
    });
  }

  get(key: string, sessionId?: string, userType?: 'admin' | 'client'): unknown | null {
    const item = this.cache.get(key);
    if (!item) {
      cachePerformance.recordMiss();
      return null;
    }

    const isExpired = Date.now() - item.timestamp > item.ttl;
    if (isExpired) {
      this.cache.delete(key);
      cachePerformance.recordMiss();
      return null;
    }

    // Check session-specific cache
    if (sessionId && item.sessionId && item.sessionId !== sessionId) {
      cachePerformance.recordMiss();
      return null;
    }

    // Check user type specific cache
    if (userType && item.userType && item.userType !== userType) {
      cachePerformance.recordMiss();
      return null;
    }

    cachePerformance.recordHit();
    return item.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear(sessionId?: string, userType?: 'admin' | 'client') {
    if (sessionId || userType) {
      // Clear only specific session/user type cache
      for (const [key, item] of this.cache.entries()) {
        if ((sessionId && item.sessionId === sessionId) || 
            (userType && item.userType === userType)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  has(key: string, sessionId?: string, userType?: 'admin' | 'client'): boolean {
    return this.cache.has(key) && this.get(key, sessionId, userType) !== null;
  }

  // Get cache statistics
  getStats() {
    const stats = {
      totalEntries: this.cache.size,
      adminEntries: 0,
      clientEntries: 0,
      sessionSpecificEntries: 0,
      expiredEntries: 0,
    };

    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.userType === 'admin') {
        stats.adminEntries++;
      } else if (item.userType === 'client') {
        stats.clientEntries++;
      }
      
      if (item.sessionId) {
        stats.sessionSpecificEntries++;
      }
      
      if (now - item.timestamp > item.ttl) {
        stats.expiredEntries++;
      }
    }

    return stats;
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheManager = new CacheManager();

// Cache keys
export const CACHE_KEYS = {
  SERVICES: 'services',
  OILS: 'oils',
  PACKAGES: 'packages',
  THERAPIST_INFO: 'therapist_info',
  USER_PREFERENCES: 'user_preferences',
  BOOKINGS: 'bookings',
  INQUIRIES: 'inquiries',
  FEEDBACK: 'feedback',
  DASHBOARD_STATS: 'dashboard_stats',
} as const;

// Cache cleanup every 5 minutes
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000);

// Performance monitoring and optimization
export const cacheOptimization = {
  // Preload frequently used data
  preload: async (keys: string[]) => {
    for (const key of keys) {
      if (!cacheManager.has(key)) {
        // Trigger data loading for missing cache entries
        console.log(`Preloading cache for key: ${key}`);
      }
    }
  },
  
  // Batch cache operations
  batchSet: (entries: Array<{key: string, data: unknown, ttl?: number, sessionId?: string, userType?: 'admin' | 'client'}>) => {
    entries.forEach(({key, data, ttl = 5 * 60 * 1000, sessionId, userType}) => {
      cacheManager.set(key, data, ttl, sessionId, userType);
    });
  },
  
  // Get multiple cache entries at once
  batchGet: (keys: string[], sessionId?: string, userType?: 'admin' | 'client') => {
    const results: Record<string, unknown> = {};
    keys.forEach(key => {
      const value = cacheManager.get(key, sessionId, userType);
      if (value !== null) {
        results[key] = value;
      }
    });
    return results;
  },
  
  // Clear cache by pattern
  clearByPattern: (pattern: RegExp) => {
    for (const [key] of cacheManager['cache'].entries()) {
      if (pattern.test(key)) {
        cacheManager.delete(key);
      }
    }
  }
};

// Performance monitoring
export const cachePerformance = {
  hits: 0,
  misses: 0,
  
  recordHit() {
    this.hits++;
  },
  
  recordMiss() {
    this.misses++;
  },
  
  getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? (this.hits / total) * 100 : 0;
  },
  
  reset() {
    this.hits = 0;
    this.misses = 0;
  }
};

// Cache with localStorage fallback
export const persistentCache = {
  set: (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },

  get: (key: string): unknown | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to read from localStorage:', error);
      return null;
    }
  },

  delete: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to delete from localStorage:', error);
    }
  },
}; 