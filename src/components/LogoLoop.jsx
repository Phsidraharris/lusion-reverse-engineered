import React from 'react';
import { motion } from 'framer-motion';

const LogoLoop = ({ 
  logos = [], 
  speed = 50, 
  direction = 'left',
  className = '',
  ...props 
}) => {
  if (logos.length === 0) return null;

  // Duplicate logos to create seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className={`overflow-hidden ${className}`} {...props}>
      <motion.div
        className="flex gap-8 items-center"
        animate={{
          x: direction === 'left' ? -logos.length * 200 : logos.length * 200,
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: `${duplicatedLogos.length * 200}px`,
        }}
      >
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-48 h-16 flex items-center justify-center"
          >
            {typeof logo === 'string' ? (
              <img 
                src={logo} 
                alt={`Logo ${index}`} 
                className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            ) : (
              logo
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default LogoLoop;