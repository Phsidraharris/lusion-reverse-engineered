import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const GlassSurface = ({
  children,
  width = '100%',
  height = '100%',
  borderRadius = 16,
  borderWidth = 1,
  brightness = 1.2,
  opacity = 0.8,
  blur = 10,
  displace = 2,
  backgroundOpacity = 0.1,
  saturation = 1.5,
  distortionScale = 0.5,
  redOffset = 0,
  greenOffset = 0,
  blueOffset = 0,
  xChannel = 'R',
  yChannel = 'G',
  mixBlendMode = 'normal',
  className = '',
  style = {},
  ...props
}) => {
  const containerRef = useRef(null);

  const glassStyle = useMemo(() => ({
    width,
    height,
    borderRadius: `${borderRadius}px`,
    background: `rgba(255, 255, 255, ${backgroundOpacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}) brightness(${brightness})`,
    border: `${borderWidth}px solid rgba(255, 255, 255, 0.2)`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    position: 'relative',
    overflow: 'hidden',
    mixBlendMode,
    ...style,
  }), [
    width, height, borderRadius, borderWidth, brightness,
    opacity, blur, backgroundOpacity, saturation, mixBlendMode, style
  ]);

  return (
    <motion.div
      ref={containerRef}
      className={`glass-surface ${className}`}
      style={glassStyle}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      {...props}
    >
      {/* SVG Filter for advanced effects */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={`glass-displacement-${Math.random().toString(36).substr(2, 9)}`}>
            <feTurbulence
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
              seed="1"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={distortionScale}
            />
            <feColorMatrix
              in="SourceGraphic"
              type="saturate"
              values={saturation}
            />
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 .5 .5 .7 .7 .7 1 1" />
            </feComponentTransfer>
            <feComposite
              operator="multiply"
              in2="SourceGraphic"
            />
          </filter>
        </defs>
      </svg>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          filter: `url(#glass-displacement-${Math.random().toString(36).substr(2, 9)})`,
        }}
      >
        {children}
      </div>

      {/* Animated border gradient */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent)`,
          padding: '1px',
          mask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          maskComposite: 'xor',
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Inner glow effect */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)`,
          mixBlendMode: 'overlay',
        }}
      />
    </motion.div>
  );
};

export default GlassSurface;