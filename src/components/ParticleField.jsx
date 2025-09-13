import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const ParticleField = React.memo(({ 
  particleCount = 100, 
  particleColor = 'rgba(255, 255, 255, 0.5)',
  particleSize = 2,
  animationSpeed = 1,
  className = ''
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Debounced resize handler to improve performance
  const debounceResize = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Memoize particle configuration to prevent recreation
  const particleConfig = useMemo(() => ({
    count: particleCount,
    color: particleColor,
    size: particleSize,
    speed: animationSpeed
  }), [particleCount, particleColor, particleSize, animationSpeed]);

  // Extract base color from particleColor for performance
  const baseColor = useMemo(() => {
    const match = particleColor.match(/rgba?\(([^)]+)\)/);
    return match ? match[1].split(',').slice(0, 3).join(',') : '255, 255, 255';
  }, [particleColor]);

  // Optimized canvas resize handler
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  // Debounced resize for better performance
  const debouncedResize = useMemo(() => 
    debounceResize(resizeCanvas, 100), [debounceResize, resizeCanvas]
  );

  // Optimized particle initialization
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const particles = particlesRef.current;
    particles.length = 0;
    
    for (let i = 0; i < particleConfig.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * particleConfig.speed,
        vy: (Math.random() - 0.5) * particleConfig.speed,
        alpha: Math.random() * 0.5 + 0.2,
        size: Math.random() * particleConfig.size + 1,
      });
    }
  }, [particleConfig]);

  // Optimized animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = particlesRef.current;

    // Clear canvas efficiently
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pre-calculate connection threshold squared to avoid sqrt
    const connectionDistanceSquared = 100 * 100;

    // Update and draw particles
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

      // Draw particle with optimized method
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseColor}, ${particle.alpha})`;
      ctx.fill();

      // Draw connections (optimized with distance squared comparison)
      for (let i = index + 1; i < particles.length; i++) {
        const otherParticle = particles[i];
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < connectionDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          const opacity = (1 - distance / 100) * 0.2;
          
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [baseColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    resizeCanvas();
    initParticles();
    animate();

    // Add resize listener with debouncing
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [resizeCanvas, initParticles, animate, debouncedResize]);

  // Re-initialize particles when config changes
  useEffect(() => {
    initParticles();
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
});

ParticleField.displayName = 'ParticleField';

export default ParticleField;