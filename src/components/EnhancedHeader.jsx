import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoMain from '../assets/RODIAX_logo_161x161.png';
import EnhancedButton from './EnhancedButton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const menuItems = [
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Company', href: '/company' },
];

const EnhancedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSheetItemClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" aria-label="home" className="flex items-center group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <motion.img
                src={logoMain}
                alt="Rodiax Logo"
                className="h-8 sm:h-10 w-auto object-contain"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              />
              <motion.span className="ml-2 sm:ml-3 text-lg sm:text-xl font-semibold text-foreground group-hover:text-brand-accent transition-colors">
                Rodiax
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <motion.ul 
              className="flex items-center gap-6 lg:gap-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {menuItems.map((item, index) => (
                <motion.li 
                  key={item.label}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className="text-sm lg:text-base text-foreground hover:text-brand-accent transition-colors relative group"
                  >
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="block"
                    >
                      {item.label}
                    </motion.span>
                    {/* Underline animation */}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <Link to="/contact">
                <EnhancedButton
                  title="Contact Us"
                  variant="default"
                  size="sm"
                  className="bg-brand-accent hover:bg-brand-accent-hover text-white"
                />
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-foreground hover:text-brand-accent hover:bg-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isSheetOpen ? 'close' : 'menu'}
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {isSheetOpen ? <X size={24} /> : <Menu size={24} />}
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-background/95 backdrop-blur-lg">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center text-foreground">
                    <img src={logoMain} alt="Rodiax" className="h-8 w-auto mr-3" />
                    Rodiax
                  </SheetTitle>
                  <SheetDescription>
                    Pioneering the future of AI
                  </SheetDescription>
                </SheetHeader>
                
                <nav className="flex flex-col mt-8 space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={handleSheetItemClick}
                        className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-brand-accent hover:bg-accent rounded-lg transition-all duration-200"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="pt-4 mt-4 border-t border-border"
                  >
                    <Link to="/contact" onClick={handleSheetItemClick}>
                      <EnhancedButton
                        title="Contact Us"
                        className="w-full justify-center bg-brand-accent hover:bg-brand-accent-hover text-white"
                        size="lg"
                        withAnimation={false}
                      />
                    </Link>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default EnhancedHeader;