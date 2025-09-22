import React, { useEffect, useRef, useCallback, useMemo, useState } from 'react';

const PerformanceOptimizedParticleField = ({ 
  particleCount = 100, 
  particleColor = 'rgba(255, 255, 255, 0.5)',
  particleSize = 2,
  animationSpeed = 1,
  className = '',
  useOffscreenCanvas = true,
  pauseWhenHidden = true
}) => {
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const resizeTimeoutRef = useRef(null);
  const lastRenderTime = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  // Memoize particle configuration to prevent unnecessary recalculations
  const particleConfig = useMemo(() => ({
    count: particleCount,
    color: particleColor,
    size: particleSize,
    speed: animationSpeed
  }), [particleCount, particleColor, particleSize, animationSpeed]);

  // Intersection Observer for visibility detection
  useEffect(() => {
    if (!pauseWhenHidden) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start animating when element is close to viewport
      }
    );

    observer.observe(canvas);

    return () => {
      observer.disconnect();
    };
  }, [pauseWhenHidden]);

  // Debounced resize handler with performance optimizations
  const debouncedResize = useCallback((canvas, offscreenCanvas) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      const dpr = Math.min(window.devicePixelRatio, 2); // Limit DPR for performance
      const rect = canvas.getBoundingClientRect();
      const width = rect.width * dpr;
      const height = rect.height * dpr;
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      if (offscreenCanvas) {
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
      }
    }, 150);
  }, []);

  // Highly optimized animation loop
  const animate = useCallback((ctx, offscreenCtx, canvas) => {
    // Pause animation when not visible
    if (pauseWhenHidden && !isVisible) {
      animationRef.current = requestAnimationFrame(() => animate(ctx, offscreenCtx, canvas));
      return;
    }

    const now = performance.now();
    
    // Adaptive frame rate based on performance
    const targetFrameTime = isVisible ? 16.67 : 33.33; // 60fps when visible, 30fps when partially visible
    if (now - lastRenderTime.current < targetFrameTime) {
      animationRef.current = requestAnimationFrame(() => animate(ctx, offscreenCtx, canvas));
      return;
    }
    
    lastRenderTime.current = now;
    const particles = particlesRef.current;
    const activeCtx = offscreenCtx || ctx;
    
    // Use requestIdleCallback for non-critical work
    const renderFrame = () => {
      activeCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Batch particle updates for better performance
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Efficient boundary checking
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.vx = -particle.vx;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.vy = -particle.vy;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Draw particle
        activeCtx.beginPath();
        activeCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        activeCtx.fillStyle = particleConfig.color.replace('0.5', particle.alpha);
        activeCtx.fill();

        // Optimized connection rendering (only for visible particles near each other)
        if (isVisible && i < particles.length - 5) {
          for (let j = i + 1; j < Math.min(i + 6, particles.length); j++) {
            const other = particles[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < 10000) { // 100px squared - avoids sqrt
              const distance = Math.sqrt(distanceSquared);
              activeCtx.beginPath();
              activeCtx.moveTo(particle.x, particle.y);
              activeCtx.lineTo(other.x, other.y);
              activeCtx.strokeStyle = particleConfig.color.replace('0.5', (1 - distance / 100) * 0.2);
              activeCtx.lineWidth = 1;
              activeCtx.stroke();
            }
          }
        }
      }

      // Copy offscreen canvas to main canvas if using offscreen rendering
      if (offscreenCtx && useOffscreenCanvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
      }

      animationRef.current = requestAnimationFrame(() => animate(ctx, offscreenCtx, canvas));
    };

    // Use requestIdleCallback when available for smoother performance
    if ('requestIdleCallback' in window && !isVisible) {
      requestIdleCallback(renderFrame, { timeout: 50 });
    } else {
      renderFrame();
    }
  }, [particleConfig, useOffscreenCanvas, isVisible, pauseWhenHidden]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true // Better performance for animations
    });
    const particles = particlesRef.current;
    
    // Create offscreen canvas for better performance
    let offscreenCanvas = null;
    let offscreenCtx = null;
    
    if (useOffscreenCanvas && 'OffscreenCanvas' in window) {
      try {
        offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
        offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvasRef.current = offscreenCanvas;
      } catch (error) {
        console.warn('OffscreenCanvas not supported, falling back to regular canvas');
      }
    }

    // Set canvas size
    const resizeCanvas = () => {
      debouncedResize(canvas, offscreenCanvas);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Initialize particles with optimized batch creation
    const initParticles = () => {
      particles.length = 0;
      const batch = new Array(particleConfig.count);
      
      for (let i = 0; i < particleConfig.count; i++) {
        batch[i] = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * particleConfig.speed,
          vy: (Math.random() - 0.5) * particleConfig.speed,
          alpha: Math.random() * 0.5 + 0.2,
          size: Math.random() * particleConfig.size + 1,
        };
      }
      
      particles.push(...batch);
    };

    initParticles();

    // Start animation with performance optimizations
    animate(ctx, offscreenCtx, canvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [particleConfig, debouncedResize, animate, useOffscreenCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ 
        width: '100%', 
        height: '100%',
        willChange: 'auto' // Let browser optimize
      }}
    />
  );
};

export default PerformanceOptimizedParticleField;