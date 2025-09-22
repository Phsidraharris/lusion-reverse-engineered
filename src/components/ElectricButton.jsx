import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const ElectricButton = ({
  children,
  onClick,
  className = '',
  electricColor = '#00ffff',
  intensity = 1,
  duration = 0.3,
  ...props
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef(null);
  const animationRef = useRef(null);

  const handleClick = useCallback((e) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Trigger electric effect
    if (buttonRef.current) {
      buttonRef.current.style.setProperty('--electric-color', electricColor);
      buttonRef.current.style.setProperty('--electric-intensity', intensity.toString());
      buttonRef.current.classList.add('electric-active');
    }

    // Call the original onClick handler
    if (onClick) {
      onClick(e);
    }

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
      if (buttonRef.current) {
        buttonRef.current.classList.remove('electric-active');
      }
    }, duration * 1000);
  }, [isAnimating, onClick, electricColor, intensity, duration]);

  return (
    <>
      <style jsx>{`
        .electric-button {
          position: relative;
          overflow: hidden;
          border: 2px solid transparent;
          background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
          transition: all 0.3s ease;
        }

        .electric-button::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(
            45deg,
            var(--electric-color, #00ffff),
            transparent,
            var(--electric-color, #00ffff),
            transparent
          );
          background-size: 400% 400%;
          animation: electric-border 2s linear infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .electric-button.electric-active::before {
          opacity: var(--electric-intensity, 1);
          animation: electric-border 0.3s linear infinite;
        }

        .electric-button.electric-active {
          box-shadow: 0 0 20px var(--electric-color, #00ffff);
          border-color: var(--electric-color, #00ffff);
        }

        @keyframes electric-border {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 400% 400%;
          }
        }

        .electric-spark {
          position: absolute;
          width: 2px;
          height: 20px;
          background: var(--electric-color, #00ffff);
          opacity: 0;
          pointer-events: none;
        }

        .electric-spark.active {
          opacity: 1;
          animation: spark 0.3s ease-out forwards;
        }

        @keyframes spark {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(180deg);
          }
        }
      `}</style>

      <motion.button
        ref={buttonRef}
        className={`electric-button px-6 py-3 rounded-lg cursor-pointer relative ${className}`}
        onClick={handleClick}
        whileHover={{
          scale: 1.05,
          boxShadow: `0 0 15px ${electricColor}40`,
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.button>

      {/* Electric sparks container */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="electric-spark"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 45}deg)`,
              transformOrigin: '0 10px',
            }}
          />
        ))}
      </div>
    </>
  );
};

export default ElectricButton;