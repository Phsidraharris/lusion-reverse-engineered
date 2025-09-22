import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const ParticleField = ({ 
  particleCount = 100, 
  particleColor = 'rgba(255, 255, 255, 0.5)',
  particleSize = 2,
  animationSpeed = 1,
  className = '',
  useOffscreenCanvas = true
}) => {
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const resizeTimeoutRef = useRef(null);
  const lastRenderTime = useRef(0);

  // Memoize particle configuration to prevent unnecessary recalculations
  const particleConfig = useMemo(() => ({
    count: particleCount,
    color: particleColor,
    size: particleSize,
    speed: animationSpeed
  }), [particleCount, particleColor, particleSize, animationSpeed]);

  // Debounced resize handler
  const debouncedResize = useCallback((canvas, offscreenCanvas) => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = setTimeout(() => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      canvas.width = width;
      canvas.height = height;
      
      if (offscreenCanvas) {
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
      }
    }, 150); // 150ms debounce
  }, []);

  // Optimized animation loop with frame limiting
  const animate = useCallback((ctx, offscreenCtx, canvas) => {
    const now = performance.now();
    
    // Limit to 60 FPS
    if (now - lastRenderTime.current < 16.67) {
      animationRef.current = requestAnimationFrame(() => animate(ctx, offscreenCtx, canvas));
      return;
    }
    
    lastRenderTime.current = now;
    const particles = particlesRef.current;
    const activeCtx = offscreenCtx || ctx;
    
    activeCtx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.vx = -particle.vx;
      }
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.vy = -particle.vy;
      }

      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      // Draw particle
      activeCtx.beginPath();
      activeCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      activeCtx.fillStyle = particleConfig.color.replace('0.5', particle.alpha);
      activeCtx.fill();

      // Draw connections (optimize by limiting distance calculations)
      if (index < particles.length - 10) { // Limit connection calculations
        particles.slice(index + 1, index + 11).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            activeCtx.beginPath();
            activeCtx.moveTo(particle.x, particle.y);
            activeCtx.lineTo(otherParticle.x, otherParticle.y);
            activeCtx.strokeStyle = particleConfig.color.replace('0.5', (1 - distance / 100) * 0.2);
            activeCtx.lineWidth = 1;
            activeCtx.stroke();
          }
        });
      }
    });

    // If using offscreen canvas, copy to main canvas
    if (offscreenCtx && useOffscreenCanvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenCanvasRef.current, 0, 0);
    }

    animationRef.current = requestAnimationFrame(() => animate(ctx, offscreenCtx, canvas));
  }, [particleConfig, useOffscreenCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
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
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles with optimized creation
    const initParticles = () => {
      particles.length = 0;
      const batch = [];
      
      for (let i = 0; i < particleConfig.count; i++) {
        batch.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * particleConfig.speed,
          vy: (Math.random() - 0.5) * particleConfig.speed,
          alpha: Math.random() * 0.5 + 0.2,
          size: Math.random() * particleConfig.size + 1,
        });
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
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ParticleField;