import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../Assets/iitp-logo.png';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Features', 'Hall of Fame'];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/10 dark:bg-black/20 backdrop-blur-lg border-b border-white/20 shadow-xl py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md p-1 border border-white/20 flex items-center justify-center overflow-hidden"
          >
            <img src={logo} alt="IITP Logo" className="w-full h-full object-contain" />
          </motion.div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-white tracking-tight">
            AlumniConnect
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 border border-white/10 bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full">
          {navLinks.map((link) => (
            <motion.a
              key={link}
              href={`#${link.toLowerCase().replace(/\\s+/g, '-')}`}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-full transition-colors relative"
            >
              {link}
            </motion.a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white rounded-full px-6 font-medium tracking-wide">
            Login
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 shadow-[0_0_20px_rgba(79,70,229,0.4)] rounded-full px-8 font-semibold tracking-wide h-10">
              Register
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
