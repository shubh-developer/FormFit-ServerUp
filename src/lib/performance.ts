// Performance Monitoring and Optimization Utilities

import { cachePerformance } from './cache';
import { sessionPerformance } from './session';

export interface PerformanceMetrics {
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    totalEntries: number;
    adminEntries: number;
    clientEntries: number;
    sessionSpecificEntries: number;
    expiredEntries: number;
  };
  sessions: {
    activeSessions: number;
    totalSessions: number;
    expiredSessions: number;
    sessionStoreSize: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  timestamp: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private maxMetricsHistory = 100;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Collect current performance metrics
  collectMetrics(): PerformanceMetrics {
    const cacheStats = cachePerformance.getHitRate();
    const sessionStats = sessionPerformance.getStats();
    
    // Get memory usage (Node.js)
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal;
    const usedMemory = memoryUsage.heapUsed;
    
    const metrics: PerformanceMetrics = {
      cache: {
        hits: cachePerformance.hits,
        misses: cachePerformance.misses,
        hitRate: cacheStats,
        totalEntries: 0, // Will be populated by cache manager
        adminEntries: 0,
        clientEntries: 0,
        sessionSpecificEntries: 0,
        expiredEntries: 0,
      },
      sessions: sessionStats,
      memory: {
        used: usedMemory,
        total: totalMemory,
        percentage: (usedMemory / totalMemory) * 100,
      },
      timestamp: Date.now(),
    };

    // Store metrics
    this.metrics.push(metrics);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetricsHistory) {
      this.metrics = this.metrics.slice(-this.maxMetricsHistory);
    }

    return metrics;
  }

  // Get performance summary
  getSummary(): {
    averageCacheHitRate: number;
    averageMemoryUsage: number;
    totalSessionsCreated: number;
    currentActiveSessions: number;
    recommendations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        averageCacheHitRate: 0,
        averageMemoryUsage: 0,
        totalSessionsCreated: 0,
        currentActiveSessions: 0,
        recommendations: ['No metrics available yet'],
      };
    }

    const recentMetrics = this.metrics.slice(-10); // Last 10 measurements
    const averageCacheHitRate = recentMetrics.reduce((sum, m) => sum + m.cache.hitRate, 0) / recentMetrics.length;
    const averageMemoryUsage = recentMetrics.reduce((sum, m) => sum + m.memory.percentage, 0) / recentMetrics.length;
    const totalSessionsCreated = this.metrics[this.metrics.length - 1]?.sessions.totalSessions || 0;
    const currentActiveSessions = this.metrics[this.metrics.length - 1]?.sessions.activeSessions || 0;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (averageCacheHitRate < 70) {
      recommendations.push('Cache hit rate is low. Consider increasing cache TTL or optimizing cache keys.');
    }
    
    if (averageMemoryUsage > 80) {
      recommendations.push('Memory usage is high. Consider reducing cache size or implementing more aggressive cleanup.');
    }
    
    if (currentActiveSessions > 1000) {
      recommendations.push('High number of active sessions. Consider implementing session cleanup or using external session storage.');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Performance metrics look good!');
    }

    return {
      averageCacheHitRate,
      averageMemoryUsage,
      totalSessionsCreated,
      currentActiveSessions,
      recommendations,
    };
  }

  // Get metrics history
  getMetricsHistory(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Clear metrics history
  clearHistory(): void {
    this.metrics = [];
  }

  // Start automatic monitoring
  startMonitoring(intervalMs: number = 60000): void {
    setInterval(() => {
      this.collectMetrics();
    }, intervalMs);
  }

  // Log performance summary
  logSummary(): void {
    const summary = this.getSummary();
    console.log('=== Performance Summary ===');
    console.log(`Cache Hit Rate: ${summary.averageCacheHitRate.toFixed(2)}%`);
    console.log(`Memory Usage: ${summary.averageMemoryUsage.toFixed(2)}%`);
    console.log(`Active Sessions: ${summary.currentActiveSessions}`);
    console.log(`Total Sessions Created: ${summary.totalSessionsCreated}`);
    console.log('Recommendations:');
    summary.recommendations.forEach(rec => console.log(`- ${rec}`));
    console.log('========================');
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Start monitoring automatically
performanceMonitor.startMonitoring();

// Log summary every 5 minutes
setInterval(() => {
  performanceMonitor.logSummary();
}, 5 * 60 * 1000);

