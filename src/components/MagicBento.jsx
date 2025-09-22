import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const MagicBento = ({
  children,
  spotlightRadius = 400,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  particleCount = 12,
  enableTilt = true,
  glowColor = "132, 0, 255",
  clickEffect = true,
  enableMagnetism = true,
  className = '',
  ...props
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback((e) => {
    if (!clickEffect) return;

    // Create click particles
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      x: mousePosition.x,
      y: mousePosition.y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
    }));

    setStars(prev => [...prev, ...particles]);
  }, [clickEffect, particleCount, mousePosition]);

  // Animate stars/particles
  useEffect(() => {
    if (stars.length === 0) return;

    const animateStars = () => {
      setStars(prev =>
        prev
          .map(star => ({
            ...star,
            x: star.x + star.vx,
            y: star.y + star.vy,
            vx: star.vx * 0.95,
            vy: star.vy * 0.95,
            life: star.life - 0.02,
          }))
          .filter(star => star.life > 0)
      );

      animationRef.current = requestAnimationFrame(animateStars);
    };

    animationRef.current = requestAnimationFrame(animateStars);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stars]);

  const tiltStyle = enableTilt && isHovered ? {
    transform: `perspective(1000px) rotateX(${(mousePosition.y - 200) * 0.01}deg) rotateY(${(mousePosition.x - 200) * 0.01}deg)`,
  } : {};

  return (
    <>
      <style jsx>{`
        .magic-bento {
          position: relative;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .magic-bento::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(
            circle ${spotlightRadius}px at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(${glowColor}, 0.1) 0%,
            transparent 50%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: 1;
        }

        .magic-bento:hover::before {
          opacity: 1;
        }

        .magic-bento::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, rgba(${glowColor}, 0.5), transparent, rgba(${glowColor}, 0.5));
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .magic-bento:hover::after {
          opacity: 0.6;
        }

        .star-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(${glowColor}, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 10;
        }

        .magnetic-element {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>

      <motion.div
        ref={containerRef}
        className={`magic-bento ${className}`}
        style={{
          '--mouse-x': `${mousePosition.x}px`,
          '--mouse-y': `${mousePosition.y}px`,
          ...tiltStyle,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={enableMagnetism ? {
          scale: 1.05,
        } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        {...props}
      >
        {/* Spotlight effect */}
        {enableSpotlight && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle ${spotlightRadius}px at ${mousePosition.x}px ${mousePosition.y}px, rgba(${glowColor}, 0.1), transparent)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {/* Border glow */}
        {enableBorderGlow && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `linear-gradient(45deg, rgba(${glowColor}, 0.3), transparent, rgba(${glowColor}, 0.3))`,
              padding: '2px',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              opacity: isHovered ? 0.8 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {/* Animated stars/particles */}
        {enableStars && stars.map((star) => (
          <motion.div
            key={star.id}
            className="star-particle"
            style={{
              left: star.x,
              top: star.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: star.life,
              opacity: star.life,
              x: star.x + star.vx * 5,
              y: star.y + star.vy * 5,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ))}

        {/* Content with magnetic effect */}
        <div
          className={enableMagnetism ? 'magnetic-element' : ''}
          style={{
            transform: enableMagnetism && isHovered
              ? `translate(${Math.min((mousePosition.x - 200) * 0.1, 20)}px, ${Math.min((mousePosition.y - 200) * 0.1, 20)}px)`
              : 'translate(0, 0)',
          }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
};

export default MagicBento;