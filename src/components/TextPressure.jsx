import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const TextPressure = ({
  text = '',
  fontFamily = 'Arial, sans-serif',
  fontUrl = null,
  textColor = '#000000',
  strokeColor = '#000000',
  strokeWidth = 0,
  width = false,
  weight = false,
  italic = false,
  alpha = false,
  scale = false,
  flex = true,
  minFontSize = 16,
  className = '',
  ...props
}) => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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

  useEffect(() => {
    if (fontUrl) {
      const font = new FontFace('CustomFont', `url(${fontUrl})`);
      font.load().then(() => {
        document.fonts.add(font);
      });
    }
  }, [fontUrl]);

  const getPressure = (charIndex) => {
    if (!isHovered || !containerRef.current) return 0;

    const container = containerRef.current;
    const chars = container.querySelectorAll('.pressure-char');

    if (!chars[charIndex]) return 0;

    const char = chars[charIndex];
    const charRect = char.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const charCenterX = charRect.left + charRect.width / 2 - containerRect.left;
    const charCenterY = charRect.top + charRect.height / 2 - containerRect.top;

    const distance = Math.sqrt(
      Math.pow(mousePosition.x - charCenterX, 2) +
      Math.pow(mousePosition.y - charCenterY, 2)
    );

    const maxDistance = 100; // Maximum distance for effect
    return Math.max(0, 1 - distance / maxDistance);
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      const pressure = getPressure(index);
      const fontSize = Math.max(minFontSize, 16 + pressure * 20);
      const opacity = alpha ? pressure : 1;
      const fontWeight = weight ? Math.max(400, 100 + pressure * 900) : 400;
      const fontStyle = italic && pressure > 0.5 ? 'italic' : 'normal';

      return (
        <motion.span
          key={index}
          className="pressure-char inline-block"
          style={{
            fontSize: `${fontSize}px`,
            opacity,
            fontWeight,
            fontStyle,
            fontFamily: fontUrl ? 'CustomFont' : fontFamily,
            color: textColor,
            WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px ${strokeColor}` : 'none',
            textShadow: strokeWidth > 0 ? `0 0 ${strokeWidth}px ${strokeColor}` : 'none',
          }}
          animate={{
            scale: scale ? 1 + pressure * 0.3 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {char}
        </motion.span>
      );
    });
  };

  const containerStyle = {
    display: flex ? 'flex' : 'block',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };

  return (
    <div
      ref={containerRef}
      className={`text-pressure ${className}`}
      style={containerStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {renderText()}
    </div>
  );
};

export default TextPressure;