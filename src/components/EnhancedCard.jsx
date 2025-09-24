import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * Enhanced Card component that replaces LazyGlareCard with shadcn/ui base
 * Maintains visual effects while improving accessibility and responsiveness
 */
const EnhancedCard = React.forwardRef(({
  children,
  title,
  description,
  className,
  withGlare = true,
  withHover = true,
  delay = 0,
  ...props
}, ref) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.6,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={withHover ? "hover" : undefined}
      {...(withHover && { variants: { ...cardVariants, ...hoverVariants } })}
      className="h-full"
    >
      <Card
        className={cn(
          // Base card styling
          "h-full relative overflow-hidden",
          // Enhanced mobile responsiveness
          "min-h-[200px] sm:min-h-[250px]",
          // Improved touch targets
          "active:scale-95 transition-all duration-300",
          // Better focus states
          "focus-within:ring-2 focus-within:ring-brand-accent/50",
          // Glass morphism effect
          withGlare && "bg-card/80 backdrop-blur-sm border-border/50",
          // Hover effects
          withHover && "hover:shadow-xl hover:border-brand-accent/20",
          className
        )}
        {...props}
      >
        {/* Optional glare effect */}
        {withGlare && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        )}
        
        {/* Content */}
        {(title || description) ? (
          <>
            {(title || description) && (
              <CardHeader className="pb-3">
                {title && (
                  <CardTitle className="text-lg sm:text-xl font-semibold text-foreground line-clamp-2">
                    {title}
                  </CardTitle>
                )}
                {description && (
                  <CardDescription className="text-sm text-muted-foreground line-clamp-3">
                    {description}
                  </CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent className="pt-0 h-full">
              {children}
            </CardContent>
          </>
        ) : (
          <CardContent className="p-6 h-full">
            {children}
          </CardContent>
        )}

        {/* Interactive overlay for better touch handling on mobile */}
        <div className="absolute inset-0 bg-transparent hover:bg-accent/5 transition-colors duration-300 rounded-lg" />
      </Card>
    </motion.div>
  );
});

EnhancedCard.displayName = 'EnhancedCard';

export default EnhancedCard;