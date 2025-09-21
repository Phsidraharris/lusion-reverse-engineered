import React, { useRef, useEffect } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';

const FloatingElements = ({ count = 20, className = '' }) => {
  const containerRef = useRef(null);

  const elements = Array.from({ length: count }, (_, i) => ({
    id: i,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    speed: Math.random() * 0.5 + 0.1,
    amplitude: Math.random() * 30 + 10,
    frequency: Math.random() * 0.02 + 0.01,
    size: Math.random() * 8 + 4,
    opacity: Math.random() * 0.3 + 0.1,
  }));

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {elements.map((element) => (
        <FloatingElement key={element.id} {...element} />
      ))}
    </div>
  );
};

const FloatingElement = ({ initialX, initialY, speed, amplitude, frequency, size, opacity }) => {
  const elementRef = useRef(null);
  const timeRef = useRef(0);

  useAnimationFrame(() => {
    if (!elementRef.current) return;

    timeRef.current += speed;
    const x = initialX + Math.sin(timeRef.current * frequency) * amplitude;
    const y = initialY + Math.cos(timeRef.current * frequency * 0.7) * amplitude * 0.5;
    
    elementRef.current.style.transform = `translate(${x}vw, ${y}vh)`;
  });

  return (
    <motion.div
      ref={elementRef}
      className="absolute rounded-full bg-gradient-to-br from-blue-400/30 to-purple-600/30 blur-sm"
      style={{
        width: size,
        height: size,
        opacity,
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 2, delay: Math.random() * 2 }}
    />
  );
};

export default FloatingElements;