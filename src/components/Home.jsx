import Button from './Button';
import { motion } from 'framer-motion';
import { Suspense, useMemo } from 'react';
import SplitText from './SplitText';
import RotatingText from './RotatingText';
import TypewriterText from './TypewriterText';
import { LazyFloatingElements } from './LazyComponents';

function Home() {
  // Memoize animation objects to prevent recreation
  const heroAnimation = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const wordAnimation = useMemo(() => ({
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: {
        ease: 'circOut',
        duration: 0.8,
      },
    },
  }), []);

  // Memoize rotating words array
  const rotatingWords = useMemo(() => [
    'Enterprise AI Platform',
    'Generative AI Solution',
    'Intelligence Platform',
    'AI Development Hub'
  ], []);

  return (
    <section
      id="hero-with-physics"
      className="relative w-full min-h-screen overflow-hidden hero-stack"
      style={{
        marginInline: 'auto',
        padding: 0,
        height: '100vh'
      }}
    >
      {/* Single shared canvas for 3D background */}
      <canvas
        id="canvas"
        className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none"
      />
      
      {/* Physics background anchor (stretches to viewport width) */}
      <div
        id="physics-sandbox-div"
        className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 pointer-events-none"
        style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}
      />
      
      {/* Content container - centered with max width */}
  <div className="relative max-w-screen-lg mx-auto px-6 flex flex-col justify-center items-start min-h-screen z-10" style={{paddingTop:0,paddingBottom:0,marginTop:0,marginBottom:0}}>
        
        {/* Add floating elements for enhanced visual appeal with lazy loading */}
        <Suspense fallback={null}>
          <LazyFloatingElements count={15} />
        </Suspense>

        <div className="flex flex-col justify-center items-start gap-y-8 text-brand-text">
          <motion.h1
            className="text-5xl lg:text-7xl font-bold leading-tight"
            variants={heroAnimation}
            initial="hidden"
            animate="visible"
          >
            <SplitText variants={wordAnimation}>The Leading</SplitText>
            <br />
            <RotatingText 
              texts={rotatingWords}
              className="bg-gradient-to-r from-brand-accent to-brand-accent-hover bg-clip-text text-transparent"
            />
          </motion.h1>

          <motion.p 
            className="text-2xl lg:text-4xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Built on the language of business
          </motion.p>

          <motion.p 
            className="text-lg lg:text-xl max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Optimized for enterprise generative AI, search and discovery, and
            advanced retrieval.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              bgColor="bg-brand-accent hover:bg-brand-accent-hover"
              textColor="text-white"
              title="Contact Sales"
              textSize="text-base"
            />
            <Button
              bgColor="bg-transparent hover:bg-brand-text/10"
              textColor="text-brand-text"
              title="Try the Playground"
              textSize="text-base"
              className="border border-brand-text/20"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default Home;
