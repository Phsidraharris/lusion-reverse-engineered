import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplitText = ({
  children,
  text,
  splitBy = 'words', // 'words', 'characters', 'lines'
  staggerDuration = 0.1,
  animationType = 'fadeUp', // 'fadeUp', 'fadeIn', 'slideIn', 'scale', 'rotate'
  className = '',
  onLetterAnimationComplete,
  ...rest
}) => {
  const [visibleChars, setVisibleChars] = useState(0);
  const textToSplit = text || children;

  if (!textToSplit) return null;

  const splitText = useMemo(() => {
    switch (splitBy) {
      case 'characters':
        return textToSplit.split('');
      case 'lines':
        return textToSplit.split('\n');
      case 'words':
      default:
        return textToSplit.split(' ');
    }
  }, [textToSplit, splitBy]);

  const getAnimationVariants = (index) => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.5,
          delay: index * staggerDuration,
          ease: 'easeOut',
        },
      },
    };

    switch (animationType) {
      case 'fadeUp':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              delay: index * staggerDuration,
              ease: 'easeOut',
            },
          },
        };
      case 'slideIn':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.5,
              delay: index * staggerDuration,
              ease: 'easeOut',
            },
          },
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.5 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              delay: index * staggerDuration,
              ease: 'backOut',
            },
          },
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotateX: 90 },
          visible: {
            opacity: 1,
            rotateX: 0,
            transition: {
              duration: 0.6,
              delay: index * staggerDuration,
              ease: 'easeOut',
            },
          },
        };
      case 'fadeIn':
      default:
        return baseVariants;
    }
  };

  useEffect(() => {
    let timeout;
    if (visibleChars < splitText.length) {
      timeout = setTimeout(() => {
        setVisibleChars(prev => {
          const next = prev + 1;
          if (next === splitText.length && onLetterAnimationComplete) {
            onLetterAnimationComplete();
          }
          return next;
        });
      }, staggerDuration * 1000);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [visibleChars, splitText.length, staggerDuration, onLetterAnimationComplete]);

  const renderContent = () => {
    return splitText.map((part, i) => {
      const isVisible = i < visibleChars;
      const variants = getAnimationVariants(i);
      const separator = splitBy === 'characters' ? '' : (i !== splitText.length - 1 ? '\u00A0' : '');

      return (
        <div
          key={`${textToSplit}-${i}-${splitBy}`}
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            perspective: animationType === 'rotate' ? '1000px' : 'none'
          }}
        >
          <motion.div
            {...rest}
            style={{
              display: 'inline-block',
              willChange: 'transform, opacity',
              transformStyle: animationType === 'rotate' ? 'preserve-3d' : 'flat',
            }}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={variants}
            custom={i}
          >
            {part}
            {separator}
          </motion.div>
        </div>
      );
    });
  };

  return (
    <div className={`split-text ${className}`}>
      {renderContent()}
    </div>
  );
};

export default SplitText;
