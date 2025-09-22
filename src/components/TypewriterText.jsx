import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterText = ({ 
  texts = [], 
  typingSpeed = 100, 
  deletingSpeed = 50, 
  pauseDuration = 2000,
  className = '',
  showCursor = true 
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursorState, setShowCursorState] = useState(true);

  // Memoize text array to prevent unnecessary re-renders
  const memoizedTexts = useMemo(() => texts, [texts]);

  const handleTyping = useCallback(() => {
    if (memoizedTexts.length === 0) return;

    const fullText = memoizedTexts[currentTextIndex];

    if (!isDeleting) {
      // Typing
      if (currentText.length < fullText.length) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      } else {
        // Finished typing, start deleting after pause
        setTimeout(() => setIsDeleting(true), pauseDuration);
      }
    } else {
      // Deleting
      if (currentText.length > 0) {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % memoizedTexts.length);
      }
    }
  }, [currentText, currentTextIndex, isDeleting, memoizedTexts, pauseDuration]);

  useEffect(() => {
    if (memoizedTexts.length === 0) return;

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timeout = setTimeout(handleTyping, speed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, typingSpeed, deletingSpeed, handleTyping, memoizedTexts.length]);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursorState(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  return (
    <span className={className}>
      {currentText}
      {showCursor && (
        <motion.span
          animate={{ opacity: showCursorState ? 1 : 0 }}
          transition={{ duration: 0.1 }}
          className="inline-block w-0.5 h-1em bg-current ml-1"
        >
          |
        </motion.span>
      )}
    </span>
  );
};

export default TypewriterText;