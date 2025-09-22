import React, { useEffect, useRef, useMemo, useCallback } from 'react';

const AnimatedBackground = ({ children, className = '', particleCount = 50 }) => {
  const containerRef = useRef(null);

  // Memoize particle configuration
  const particleConfig = useMemo(() => ({
    count: particleCount,
    className: 'absolute w-1 h-1 bg-white/20 rounded-full animate-pulse',
    maxAnimationDuration: 3,
    minAnimationDuration: 2,
    maxAnimationDelay: 2
  }), [particleCount]);

  // Memoize particle creation function
  const createParticle = useCallback((index) => {
    const particle = document.createElement('div');
    particle.className = particleConfig.className;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * particleConfig.maxAnimationDuration + particleConfig.minAnimationDuration) + 's';
    particle.style.animationDelay = Math.random() * particleConfig.maxAnimationDelay + 's';
    return particle;
  }, [particleConfig]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating particles
    const particles = [];

    for (let i = 0; i < particleConfig.count; i++) {
      const particle = createParticle(i);
      container.appendChild(particle);
      particles.push(particle);
    }

    // Animate particles
    const animateParticles = () => {
      particles.forEach(particle => {
        const currentTop = parseFloat(particle.style.top);
        const newTop = currentTop <= -2 ? 100 : currentTop - 0.1;
        particle.style.top = newTop + '%';
      });
      requestAnimationFrame(animateParticles);
    };

    animateParticles();

    // Cleanup
    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [particleConfig, createParticle]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-x"></div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }}
      ></div>
      
      {children}
      
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-100%);
          }
        }
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;