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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-background/80 backdrop-blur-lg shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-screen-lg mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" aria-label="home" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
            <motion.img
              src={logoMain}
              alt="Rodiax Logo"
              className="h-10 w-auto object-contain"
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            />
              <motion.span className="ml-3 text-xl font-semibold text-brand-text">
                Rodiax
              </motion.span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <motion.ul 
              className="flex items-center gap-8"
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
                    className="text-base text-brand-text hover:text-brand-accent transition-colors"
                  >
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.label}
                    </motion.span>
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
                  bgColor="bg-brand-accent hover:bg-brand-accent-hover"
                  textColor="text-white"
                  textSize="text-sm"
                />
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="text-brand-text"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-brand-background shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="px-6 pt-2 pb-4 flex flex-col gap-4">
              {menuItems.map((item, index) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="block text-base text-brand-text hover:text-brand-accent"
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
                  bgColor="bg-brand-accent hover:bg-brand-accent-hover"
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
