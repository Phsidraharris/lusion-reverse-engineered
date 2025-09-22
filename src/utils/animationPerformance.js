/**
 * Performance monitoring utility for animation components
 */

class AnimationPerformanceMonitor {
  constructor() {
    this.metrics = {
      frameCount: 0,
      totalFrameTime: 0,
      maxFrameTime: 0,
      minFrameTime: Infinity,
      lastFrameTime: 0,
      averageFPS: 0,
      droppedFrames: 0
    };
    
    this.isMonitoring = false;
    this.targetFPS = 60;
    this.frameThreshold = 1000 / this.targetFPS * 1.5; // 1.5x target frame time
  }

  start() {
    this.isMonitoring = true;
    this.metrics.lastFrameTime = performance.now();
    console.log('🎬 Animation performance monitoring started');
  }

  stop() {
    this.isMonitoring = false;
    console.log('🎬 Animation performance monitoring stopped');
    this.logSummary();
  }

  recordFrame() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    const frameTime = now - this.metrics.lastFrameTime;
    
    this.metrics.frameCount++;
    this.metrics.totalFrameTime += frameTime;
    this.metrics.maxFrameTime = Math.max(this.metrics.maxFrameTime, frameTime);
    this.metrics.minFrameTime = Math.min(this.metrics.minFrameTime, frameTime);
    this.metrics.lastFrameTime = now;

    // Check for dropped frames
    if (frameTime > this.frameThreshold) {
      this.metrics.droppedFrames++;
    }

    // Calculate average FPS every 60 frames
    if (this.metrics.frameCount % 60 === 0) {
      this.metrics.averageFPS = 1000 / (this.metrics.totalFrameTime / this.metrics.frameCount);
    }
  }

  logSummary() {
    const avgFrameTime = this.metrics.totalFrameTime / this.metrics.frameCount;
    const avgFPS = 1000 / avgFrameTime;
    const dropRate = (this.metrics.droppedFrames / this.metrics.frameCount) * 100;

    console.group('🎬 Animation Performance Summary');
    console.log(`📊 Total Frames: ${this.metrics.frameCount}`);
    console.log(`⏱️ Average Frame Time: ${avgFrameTime.toFixed(2)}ms`);
    console.log(`🏃 Average FPS: ${avgFPS.toFixed(1)}`);
    console.log(`📈 Max Frame Time: ${this.metrics.maxFrameTime.toFixed(2)}ms`);
    console.log(`📉 Min Frame Time: ${this.metrics.minFrameTime.toFixed(2)}ms`);
    console.log(`📉 Dropped Frames: ${this.metrics.droppedFrames} (${dropRate.toFixed(1)}%)`);
    
    // Performance assessment
    if (avgFPS >= 55) {
      console.log('✅ Excellent performance');
    } else if (avgFPS >= 45) {
      console.log('⚠️ Good performance with occasional drops');
    } else if (avgFPS >= 30) {
      console.log('🔶 Acceptable performance for complex animations');
    } else {
      console.log('🔴 Performance optimization needed');
    }
    
    console.groupEnd();
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageFrameTime: this.metrics.totalFrameTime / this.metrics.frameCount,
      currentFPS: this.metrics.averageFPS,
      dropRate: (this.metrics.droppedFrames / this.metrics.frameCount) * 100
    };
  }
}

// Global performance monitor instance
export const performanceMonitor = new AnimationPerformanceMonitor();

// React hook for performance monitoring
export const useAnimationPerformance = (componentName = 'Component') => {
  const monitor = React.useRef(new AnimationPerformanceMonitor());
  
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      monitor.current.start();
      console.log(`🎬 Started monitoring performance for ${componentName}`);
    }
    
    return () => {
      if (process.env.NODE_ENV === 'development') {
        monitor.current.stop();
      }
    };
  }, [componentName]);

  return {
    recordFrame: () => monitor.current.recordFrame(),
    getMetrics: () => monitor.current.getMetrics(),
    monitor: monitor.current
  };
};

// Performance optimization utilities
export const animationUtils = {
  // Adaptive quality based on performance
  getAdaptiveQuality: (fps) => {
    if (fps >= 55) return { quality: 'high', particleCount: 1.0, connectionDistance: 100 };
    if (fps >= 45) return { quality: 'medium', particleCount: 0.8, connectionDistance: 80 };
    if (fps >= 30) return { quality: 'low', particleCount: 0.6, connectionDistance: 60 };
    return { quality: 'minimal', particleCount: 0.4, connectionDistance: 40 };
  },

  // Debounce function with leading edge option
  debounce: (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  },

  // Throttle function for high-frequency events
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Check if reduced motion is preferred
  prefersReducedMotion: () => {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Get optimal animation settings based on device capabilities
  getOptimalSettings: () => {
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const reducedMotion = animationUtils.prefersReducedMotion();

    return {
      targetFPS: reducedMotion ? 30 : isMobile ? 45 : 60,
      particleCount: reducedMotion ? 20 : isLowEnd ? 50 : isMobile ? 75 : 100,
      useOffscreenCanvas: !isMobile && 'OffscreenCanvas' in window,
      connectionDistance: reducedMotion ? 50 : isLowEnd ? 60 : 100,
      pauseWhenHidden: true,
      animationSpeed: reducedMotion ? 0.5 : 1
    };
  }
};

export default AnimationPerformanceMonitor;