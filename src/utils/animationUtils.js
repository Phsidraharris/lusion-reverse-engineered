/**
 * Animation utilities for optimizing performance and creating smooth animations
 */

// Debounce function for resize and scroll events
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for continuous events like mousemove
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Request animation frame wrapper for smooth animations
export const raf = (callback) => {
  if (typeof window !== 'undefined') {
    return requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16); // Fallback to ~60fps
};

// Cancel animation frame wrapper
export const cancelRaf = (id) => {
  if (typeof window !== 'undefined') {
    return cancelAnimationFrame(id);
  }
  return clearTimeout(id);
};

// Performance monitoring for animations
export const measurePerformance = (name, fn) => {
  if (typeof window !== 'undefined' && window.performance) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
  }
  return fn();
};

// Prefers reduced motion detection
export const prefersReducedMotion = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Animation presets for consistent motion
export const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: 'backOut' },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.6,
      ease: [0.68, -0.55, 0.265, 1.55],
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

// Stagger children animation helper
export const staggerChildren = (children, staggerDelay = 0.1) => {
  return children.map((child, index) => ({
    ...child,
    transition: {
      ...child.transition,
      delay: index * staggerDelay,
    },
  }));
};

// Intersection Observer for scroll-triggered animations
export const createScrollTrigger = (callback, options = {}) => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }

  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Performance optimized mouse position tracker
export const useOptimizedMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = throttle((e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, 16); // ~60fps

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return mousePosition;
};

// Easing functions for custom animations
export const easing = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  elastic: [0.175, 0.885, 0.32, 1.275],
};

// Color interpolation for smooth color transitions
export const interpolateColor = (color1, color2, factor) => {
  const c1 = color1.match(/\d+/g).map(Number);
  const c2 = color2.match(/\d+/g).map(Number);

  const r = Math.round(c1[0] + (c2[0] - c1[0]) * factor);
  const g = Math.round(c1[1] + (c2[1] - c1[1]) * factor);
  const b = Math.round(c1[2] + (c2[2] - c1[2]) * factor);

  return `rgb(${r}, ${g}, ${b})`;
};

// Memory cleanup for animation instances
export const cleanupAnimations = (animations) => {
  animations.forEach(animation => {
    if (animation && typeof animation.stop === 'function') {
      animation.stop();
    }
  });
};

// GPU acceleration helpers
export const gpuAccelerate = {
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden',
  perspective: 1000,
};

// Check if device supports certain features
export const supportsFeature = (feature) => {
  const testElement = document.createElement('div');

  switch (feature) {
    case 'backdrop-filter':
      return 'backdropFilter' in testElement.style || 'webkitBackdropFilter' in testElement.style;
    case 'css-grid':
      return 'gridTemplate' in testElement.style;
    case 'custom-properties':
      return 'var' in testElement.style;
    case 'intersection-observer':
      return 'IntersectionObserver' in window;
    default:
      return false;
  }
};

// Animation performance logger
export const logAnimationPerformance = (name, startTime, endTime) => {
  const duration = endTime - startTime;
  const fps = 1000 / duration;

  if (fps < 30) {
    console.warn(`Animation "${name}" is running at ${fps.toFixed(1)}fps - consider optimization`);
  } else if (fps < 50) {
    console.info(`Animation "${name}" is running at ${fps.toFixed(1)}fps - good performance`);
  } else {
    console.debug(`Animation "${name}" is running at ${fps.toFixed(1)}fps - excellent performance`);
  }
};

// Async animation function for Three.js animations
export const animateAsync = (duration, updateCallback) => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const percent = Math.min(elapsed / duration, 1);

      updateCallback(percent);

      if (percent < 1) {
        requestAnimationFrame(animate);
      } else {
        updateCallback(1);
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
};

// Async wait function
export const waitAsync = (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};

// Random sign helper (-1 or 1)
export const randomSign = () => {
  return Math.random() < 0.5 ? -1 : 1;
};