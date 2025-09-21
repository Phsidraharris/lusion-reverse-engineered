import React, { useEffect, useRef } from 'react';

const MorphingBlob = ({ className = '', colors = ['#6366f1', '#8b5cf6', '#06b6d4'] }) => {
  const blobRef = useRef(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    let animationId;
    let time = 0;

    const animate = () => {
      time += 0.02;
      
      const scale1 = Math.sin(time) * 0.1 + 1;
      const scale2 = Math.cos(time * 1.2) * 0.1 + 1;
      const rotate = time * 20;
      
      blob.style.transform = `
        rotate(${rotate}deg) 
        scaleX(${scale1}) 
        scaleY(${scale2})
      `;
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        ref={blobRef}
        className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-3xl"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, ${colors[0]} 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${colors[1]} 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, ${colors[2]} 0%, transparent 50%)
          `,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          animation: 'blob 7s infinite',
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