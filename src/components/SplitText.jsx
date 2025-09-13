import React from 'react';
import { motion } from 'framer-motion';

const SplitText = ({ children, text, ...rest }) => {
  const textToSplit = text || children;
  if (!textToSplit) return null;
  
  let words = textToSplit.split(' ');
  return words.map((word, i) => (
    <div
      key={(textToSplit) + i}
      style={{ display: 'inline-block', overflow: 'hidden' }}
    >
      <motion.div
        {...rest}
        style={{ display: 'inline-block', willChange: 'transform' }}
        custom={i}
      >
        {word + (i !== words.length - 1 ? '\u00A0' : '')}
      </motion.div>
    </div>
  ));
};

export default SplitText;
