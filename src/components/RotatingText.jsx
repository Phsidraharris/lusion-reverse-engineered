import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RotatingText = ({ 
  texts = [], 
  interval = 3000, 
  className = '',
  ...props 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize texts array to prevent unnecessary re-renders
  const memoizedTexts = useMemo(() => texts, [texts]);

  useEffect(() => {
    if (memoizedTexts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % memoizedTexts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [memoizedTexts.length, interval]);

  if (memoizedTexts.length === 0) return null;

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="inline-block"
        >
          {memoizedTexts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default RotatingText;