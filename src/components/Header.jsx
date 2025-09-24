import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoMain from '../assets/RODIAX_logo_161x161.png';
import Button from './Button';

const menuItems = [
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Company', href: '/company' },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <motion.header
      className={`group fixed top-0 left-0 right-0 z-50 transition-[background,backdrop-filter,box-shadow,border-color] duration-500 ease-out ${
        isScrolled
          ? 'bg-white/15 dark:bg-neutral-900/40 backdrop-blur-xl shadow-lg shadow-black/10 border-b border-white/25 dark:border-white/10'
          : 'bg-white/5 dark:bg-neutral-900/20 backdrop-blur-md border-b border-transparent'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle gradient overlays for glass depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-white/5 dark:to-transparent" />
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-brand-accent/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between transition-[height] duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <Link to="/" aria-label="home" className="flex items-center select-none">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="flex items-center"
            >
              <motion.div
                className="relative flex items-center justify-center h-11 w-11 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-sm shadow-black/10 ring-1 ring-white/20 overflow-hidden"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              >
                <img
                  src={logoMain}
                  alt="Rodiax Logo"
                  className="h-8 w-8 object-contain drop-shadow"
                  draggable={false}
                />
                <span className="absolute inset-0 bg-radial-at-t from-white/25 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
              </motion.div>
              <motion.span
                className="ml-3 text-[1.35rem] leading-none font-semibold tracking-tight bg-gradient-to-b from-white to-white/70 dark:from-white dark:to-white/60 bg-clip-text text-transparent"
                initial={{ y: 4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
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
                    className="relative flex items-center text-sm lg:text-base font-medium text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 px-3 py-2 rounded-full transition-colors"
                  >
                    <motion.span
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative z-10"
                    >
                      {item.label}
                    </motion.span>
                    <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="pointer-events-none absolute inset-0 rounded-full border border-white/10 backdrop-blur-sm" />
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
                <Button
                  title="Contact Us"
                  bgColor="bg-brand-accent/90 hover:bg-brand-accent shadow-md shadow-brand-accent/30 backdrop-blur-sm"
                  textColor="text-white"
                  textSize="text-sm"
                  className="rounded-full px-5"
                />
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-white/12 dark:bg-neutral-900/70 backdrop-blur-2xl border-t border-white/15 shadow-xl shadow-black/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-6 pt-4 pb-6 flex flex-col gap-3">
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="relative block text-base font-medium text-white/80 hover:text-white px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors"
                  onClick={closeMobileMenu}
                >
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.span>
                </Link>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button
                  title="Contact Us"
                  bgColor="bg-brand-accent/90 hover:bg-brand-accent shadow-md shadow-brand-accent/30"
                  textColor="text-white"
                  textSize="text-sm"
                  className="w-full mt-2"
                />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
