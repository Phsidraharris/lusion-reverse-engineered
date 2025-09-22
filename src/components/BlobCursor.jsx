import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const BlobCursor = ({
  blobType = 'circle',
  fillColor = '#5227FF',
  trailCount = 3,
  sizes = [60, 125, 75],
  innerSizes = [20, 35, 25],
  innerColor = 'rgba(255,255,255,0.8)',
  opacities = [0.6, 0.6, 0.6],
  shadowColor = 'rgba(0,0,0,0.75)',
  shadowBlur = 5,
  shadowOffsetX = 10,
  shadowOffsetY = 10,
  filterId = 'blob',
  filterStdDeviation = 30,
  filterColorMatrixValues = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0',
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.5,
  fastEase = 'power3.out',
  slowEase = 'power1.out',
  zIndex = 100,
}) => {
  const cursorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trailPositions, setTrailPositions] = useState(
    Array(trailCount).fill().map(() => ({ x: 0, y: 0 }))
  );

  const handleMouseMove = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    let animationId;
    const animateTrail = () => {
      setTrailPositions(prev => {
        const newTrail = [mousePosition, ...prev.slice(0, trailCount - 1)];
        return newTrail;
      });
      animationId = requestAnimationFrame(animateTrail);
    };
    animationId = requestAnimationFrame(animateTrail);
    return () => cancelAnimationFrame(animationId);
  }, [mousePosition, trailCount]);

  const renderBlob = (position, index, isLead = false) => {
    const size = sizes[index] || sizes[sizes.length - 1];
    const innerSize = innerSizes[index] || innerSizes[innerSizes.length - 1];
    const opacity = opacities[index] || opacities[opacities.length - 1];

    const borderRadius = blobType === 'square' ? '8px' : '50%';

    return (
      <motion.div
        key={index}
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 0,
          x: position.x - size / 2,
          y: position.y - size / 2,
          width: size,
          height: size,
          backgroundColor: fillColor,
          borderRadius,
          opacity,
          zIndex,
          filter: useFilter ? `url(#${filterId})` : 'none',
          boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`,
        }}
        animate={{
          x: position.x - size / 2,
          y: position.y - size / 2,
        }}
        transition={{
          type: 'spring',
          stiffness: isLead ? 1000 : 500,
          damping: isLead ? 50 : 100,
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? fastEase : slowEase,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            width: innerSize,
            height: innerSize,
            backgroundColor: innerColor,
            borderRadius: blobType === 'square' ? '4px' : '50%',
          }}
        />
      </motion.div>
    );
  };

  return (
    <>
      {useFilter && (
        <svg className="fixed inset-0 pointer-events-none" style={{ zIndex: zIndex - 1 }}>
          <defs>
            <filter id={filterId}>
              <feGaussianBlur stdDeviation={filterStdDeviation} result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      )}
      <div ref={cursorRef} className="fixed inset-0 pointer-events-none" style={{ zIndex }}>
        {trailPositions.map((position, index) => renderBlob(position, index, index === 0))}
      </div>
    </>
  );
};

export default BlobCursor;