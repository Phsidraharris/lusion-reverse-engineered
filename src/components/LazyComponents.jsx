import { lazy } from 'react';

// Lazy load heavy animation components for better code splitting
export const LazyParticleField = lazy(() => import('./ParticleField'));
export const LazyPerformanceOptimizedParticleField = lazy(() => import('./PerformanceOptimizedParticleField'));
export const LazyMorphingBlob = lazy(() => import('./MorphingBlob'));
export const LazyFloatingElements = lazy(() => import('./FloatingElements'));
export const LazyAnimatedBackground = lazy(() => import('./AnimatedBackground'));
export const LazyGlareCard = lazy(() => import('./GlareCard'));

// Lightweight animation components can be loaded normally
export { default as SplitText } from './SplitText';
export { default as ShuffleText } from './ShuffleText';
export { default as RotatingText } from './RotatingText';
export { default as TypewriterText } from './TypewriterText';
export { default as StatsSection } from './StatsSection';
export { default as LogoLoop } from './LogoLoop';