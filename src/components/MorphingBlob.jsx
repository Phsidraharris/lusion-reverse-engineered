import React, { useEffect, useRef, useMemo } from 'react';

const MorphingBlob = ({ className = '', colors = ['#6366f1', '#8b5cf6', '#06b6d4'] }) => {
  const blobRef = useRef(null);
  const animationRef = useRef(null);
  const lastUpdateTime = useRef(0);

  // Memoize colors to prevent unnecessary re-renders
  const memoizedColors = useMemo(() => colors, [colors]);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    let time = 0;
    const targetFPS = 30; // Lower FPS for morphing blob to save performance
    const frameTime = 1000 / targetFPS;

    const animate = (currentTime) => {
      if (currentTime - lastUpdateTime.current >= frameTime) {
        time += 0.02;
        
        const scale1 = Math.sin(time) * 0.1 + 1;
        const scale2 = Math.cos(time * 1.2) * 0.1 + 1;
        const rotate = time * 20;
        
        blob.style.transform = `
          rotate(${rotate}deg) 
          scaleX(${scale1}) 
          scaleY(${scale2})
        `;
        
        lastUpdateTime.current = currentTime;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Use requestIdleCallback if available for non-critical animations
    const startAnimation = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          animationRef.current = requestAnimationFrame(animate);
        });
      } else {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startAnimation();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        ref={blobRef}
        className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"
        style={{
        background: `linear-gradient(45deg, ${memoizedColors.join(', ')})`,
        filter: 'blur(60px)',
      }}
      />
      
      <style jsx>{`
        @keyframes blob {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
        }
      `}</style>
    </div>
  );
};

export default MorphingBlob;