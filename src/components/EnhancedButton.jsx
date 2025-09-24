import React from 'react';
import { motion } from 'framer-motion';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * Enhanced Button component that combines your existing design with shadcn/ui functionality
 * Maintains backward compatibility while adding modern features
 */
const EnhancedButton = React.forwardRef(({
  title,
  children,
  bgColor,
  textColor,
  textSize = 'text-base',
  className = '',
  variant = 'default',
  size = 'default',
  withAnimation = true,
  ...props
}, ref) => {
  const content = children || title;

  const buttonContent = (
    <ShadcnButton
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        // Base styles that work with shadcn variants
        "relative overflow-hidden font-semibold transition-all duration-300",
        // Custom styling for backward compatibility
        bgColor && bgColor.includes('brand-accent') ? 'bg-brand-accent hover:bg-brand-accent-hover text-white' : '',
        bgColor && bgColor.includes('transparent') ? 'bg-transparent hover:bg-brand-text/10 border border-brand-text/20' : '',
        textColor,
        textSize,
        // Enhanced mobile responsiveness
        "active:scale-95 focus:ring-2 focus:ring-brand-accent/50 focus:outline-none",
        // Better touch targets for mobile
        "min-h-[44px] min-w-[44px]",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{content}</span>
      {/* Shimmer effect for visual enhancement */}
      <motion.div
        className="absolute inset-0 bg-white/20 transform -skew-x-12"
        variants={{
          hover: {
            x: '100%',
            transition: {
              ease: 'linear',
              duration: 0.5,
            },
          },
        }}
        initial={{ x: '-100%' }}
      />
    </ShadcnButton>
  );

  if (withAnimation) {
    return (
      <motion.div
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        className="inline-block"
      >
        {buttonContent}
      </motion.div>
    );
  }

  return buttonContent;
});

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;