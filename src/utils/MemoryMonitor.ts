import * as THREE from "three";

/**
 * MemoryMonitor - Utility for tracking memory usage and performance metrics
 * 
 * Features:
 * - Browser memory usage tracking (when available)
 * - Three.js specific memory monitoring
 * - Performance metrics logging
 * - Memory leak detection
 */

interface MemoryInfo {
  jsHeapSizeLimit?: number;
  totalJSHeapSize?: number;
  usedJSHeapSize?: number;
}

interface PerformanceMetrics {
  timestamp: number;
  memoryUsage: MemoryInfo;
  rendererInfo?: {
    triangles: number;
    points: number;
    lines: number;
    calls: number;
  };
  modelManagerStats?: {
    cachedModels: number;
    estimatedMemoryMB: number;
  };
}

class MemoryMonitor {
  private static instance: MemoryMonitor;
  private metrics: PerformanceMetrics[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): MemoryMonitor {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor();
    }
    return MemoryMonitor.instance;
  }

  /**
   * Get current memory usage information
   */
  getCurrentMemoryUsage(): MemoryInfo {
    // @ts-ignore - performance.memory is not in TypeScript definitions but exists in Chrome
    const memory = (performance as any).memory;
    
    if (memory) {
      return {
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        totalJSHeapSize: memory.totalJSHeapSize,
        usedJSHeapSize: memory.usedJSHeapSize
      };
    }
    
    return {};
  }

  /**
   * Get Three.js renderer memory information
   */
  getRendererMemoryInfo(renderer?: THREE.WebGLRenderer) {
    if (!renderer) return undefined;

    return {
      triangles: renderer.info.render.triangles,
      points: renderer.info.render.points,
      lines: renderer.info.render.lines,
      calls: renderer.info.render.calls
    };
  }

  /**
   * Take a snapshot of current performance metrics
   */
  takeSnapshot(renderer?: THREE.WebGLRenderer, modelManagerStats?: any): PerformanceMetrics {
    const snapshot: PerformanceMetrics = {
      timestamp: Date.now(),
      memoryUsage: this.getCurrentMemoryUsage(),
      rendererInfo: this.getRendererMemoryInfo(renderer),
      modelManagerStats
    };

    this.metrics.push(snapshot);
    
    // Keep only last 50 snapshots to prevent memory bloat
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-50);
    }

    return snapshot;
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(intervalMs = 5000, renderer?: THREE.WebGLRenderer) {
    if (this.isMonitoring) {
      console.warn('MemoryMonitor: Already monitoring');
      return;
    }

    this.isMonitoring = true;
    console.log('MemoryMonitor: Started monitoring');

    this.monitoringInterval = setInterval(() => {
      this.takeSnapshot(renderer);
    }, intervalMs);
  }

  /**
   * Stop continuous monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('MemoryMonitor: Stopped monitoring');
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats() {
    if (this.metrics.length === 0) return null;

    const latest = this.metrics[this.metrics.length - 1];
    const oldest = this.metrics[0];

    const memoryUsage = latest.memoryUsage;
    const memoryDelta = memoryUsage.usedJSHeapSize && oldest.memoryUsage.usedJSHeapSize 
      ? memoryUsage.usedJSHeapSize - oldest.memoryUsage.usedJSHeapSize
      : 0;

    return {
      currentMemoryMB: memoryUsage.usedJSHeapSize ? Math.round(memoryUsage.usedJSHeapSize / 1024 / 1024) : 0,
      memoryLimitMB: memoryUsage.jsHeapSizeLimit ? Math.round(memoryUsage.jsHeapSizeLimit / 1024 / 1024) : 0,
      memoryDeltaMB: Math.round(memoryDelta / 1024 / 1024),
      samplesCount: this.metrics.length,
      latestTriangles: latest.rendererInfo?.triangles || 0,
      latestCalls: latest.rendererInfo?.calls || 0
    };
  }

  /**
   * Log memory comparison before/after optimization
   */
  logOptimizationComparison(beforeSnapshot: PerformanceMetrics, afterSnapshot: PerformanceMetrics) {
    const beforeMB = beforeSnapshot.memoryUsage.usedJSHeapSize 
      ? Math.round(beforeSnapshot.memoryUsage.usedJSHeapSize / 1024 / 1024)
      : 0;
    
    const afterMB = afterSnapshot.memoryUsage.usedJSHeapSize 
      ? Math.round(afterSnapshot.memoryUsage.usedJSHeapSize / 1024 / 1024)
      : 0;

    const savedMB = beforeMB - afterMB;
    const savedPercent = beforeMB > 0 ? Math.round((savedMB / beforeMB) * 100) : 0;

    console.group('🚀 Memory Optimization Results');
    console.log(`Before: ${beforeMB}MB`);
    console.log(`After: ${afterMB}MB`);
    console.log(`Saved: ${savedMB}MB (${savedPercent}%)`);
    
    if (beforeSnapshot.modelManagerStats && afterSnapshot.modelManagerStats) {
      console.log(`Cached models: ${afterSnapshot.modelManagerStats.cachedModels}`);
      console.log(`Estimated model memory: ${afterSnapshot.modelManagerStats.estimatedMemoryMB}MB`);
    }
    
    console.groupEnd();
  }

  /**
   * Clear all stored metrics
   */
  clearMetrics() {
    this.metrics = [];
    console.log('MemoryMonitor: Cleared all metrics');
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics() {
    return {
      metrics: this.metrics,
      summary: this.getMemoryStats()
    };
  }
}

// Export singleton instance
export const memoryMonitor = MemoryMonitor.getInstance();
export default MemoryMonitor; 