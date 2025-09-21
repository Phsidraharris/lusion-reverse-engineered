import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ShuffleText = ({ text, className = '', ...props }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isShuffling, setIsShuffling] = useState(false);
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
  const shuffleText = () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    const iterations = text.length;
    let iteration = 0;
    
    const interval = setInterval(() => {
      setDisplayText((current) =>
        current
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      iteration += 1;
      
      if (iteration >= iterations) {
        setDisplayText(text);
        setIsShuffling(false);
        clearInterval(interval);
      }
    }, 60);
  };
  
  useEffect(() => {
    shuffleText();
  }, [text]);
  
  return (
    <motion.span
      className={`cursor-pointer ${className}`}
      onMouseEnter={shuffleText}
      whileHover={{ scale: 1.02 }}
      {...props}
    >
      {displayText}
    </motion.span>
  );
};

export default ShuffleText;