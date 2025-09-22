import React, { useRef, useEffect, useCallback, useState } from 'react';

const Waves = ({
  lineColor = '#007bff',
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 120,
  className = '',
  style = {},
  ...props
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const pointsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width;
    canvas.height = height;
    setDimensions({ width, height });

    // Initialize wave points
    const points = [];
    const yCount = Math.ceil(height / yGap) + 2;
    const xCount = Math.ceil(width / xGap) + 2;

    for (let y = 0; y < yCount; y++) {
      for (let x = 0; x < xCount; x++) {
        points.push({
          x: x * xGap,
          y: y * yGap,
          baseX: x * xGap,
          baseY: y * yGap,
          vx: 0,
          vy: 0,
        });
      }
    }

    pointsRef.current = points;
  }, [xGap, yGap]);

  const handleMouseMove = useCallback((e) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current = { x, y };
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const points = pointsRef.current;

    if (!canvas || !ctx || points.length === 0) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update points
    points.forEach((point, index) => {
      // Mouse interaction
      const dx = mouseRef.current.x - point.x;
      const dy = mouseRef.current.y - point.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxCursorMove) {
        const force = (maxCursorMove - distance) / maxCursorMove;
        const angle = Math.atan2(dy, dx);
        point.vx -= force * Math.cos(angle) * tension;
        point.vy -= force * Math.sin(angle) * tension;
      }

      // Wave motion
      const waveX = Math.sin(point.baseY * waveSpeedY + Date.now() * waveSpeedX) * waveAmpX;
      const waveY = Math.cos(point.baseX * waveSpeedX + Date.now() * waveSpeedY) * waveAmpY;

      point.vx += (point.baseX + waveX - point.x) * tension;
      point.vy += (point.baseY + waveY - point.y) * tension;

      // Apply friction
      point.vx *= friction;
      point.vy *= friction;

      // Update position
      point.x += point.vx;
      point.y += point.vy;

      // Draw line segments
      const nextPoint = points[index + 1];
      if (nextPoint && nextPoint.baseY === point.baseY) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextPoint.x, nextPoint.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const belowPoint = points[index + Math.ceil(canvas.width / xGap) + 2];
      if (belowPoint) {
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(belowPoint.x, belowPoint.y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [lineColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, tension, friction, maxCursorMove]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleResize, handleMouseMove]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      animate();
    }
  }, [dimensions, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%', ...style }}
      {...props}
    />
  );
};

export default Waves;