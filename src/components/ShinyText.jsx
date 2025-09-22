import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const ShinyText = ({
  children,
  speed = 5,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {!disabled && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: speed,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
        />
      )}
    </div>
  );
};

export default ShinyText;