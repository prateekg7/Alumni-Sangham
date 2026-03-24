import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../Assets/iitp-logo.png';
import { Home, User, Briefcase, FileText } from 'lucide-react';

export function Navbar({ onLoginClick, onRegisterClick, className }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', url: '#home', icon: Home },
    { name: 'About', url: '#about', icon: User },
    { name: 'Features', url: '#features', icon: Briefcase },
    { name: 'Fame', url: '#hall-of-fame', icon: FileText }
  ];

  return (
    <div className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center w-full px-4 pointer-events-none ${className || ''}`}>
      <motion.nav
        layout
        initial={{ y: -100, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
        className={`pointer-events-auto flex items-center justify-between overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] backdrop-blur-3xl border border-white/10
          ${scrolled 
            ? 'py-2 px-4 gap-6 rounded-[2rem] bg-black/60 w-auto' 
            : 'py-3 px-8 gap-8 rounded-[2.5rem] bg-black/30 w-[95%] max-w-6xl'}`}
      >
        {/* Logo and Branding */}
        <motion.div layout className="flex items-center gap-3 cursor-pointer group flex-shrink-0">
          <motion.div
            layout
            whileHover={{ rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`flex items-center justify-center overflow-hidden rounded-full bg-white/10 backdrop-blur-md p-0.5 border border-white/20 transition-all duration-300 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}
          >
            <img src={logo} alt="IITP Logo" className="w-full h-full object-contain" />
          </motion.div>
          <AnimatePresence mode="popLayout">
            {!scrolled && (
              <motion.span 
                initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(5px)', scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-white tracking-tight hidden md:block select-none"
              >
                AlumniConnect
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Links / Center Island */}
        <motion.div layout className="flex items-center gap-1 sm:gap-2 border-l border-white/10 pl-2 sm:pl-4 transition-all">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={`relative flex items-center justify-center px-4 py-2 rounded-full cursor-pointer text-sm font-semibold transition-colors
                  ${isActive ? 'text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
              >
                <span className="hidden sm:inline">{item.name}</span>
                <span className="sm:hidden">
                  <Icon size={18} strokeWidth={2.5} />
                </span>
                
                {/* Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="island-active-tab"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/5"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  >
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_10px_2px_rgba(34,211,238,0.5)]" />
                  </motion.div>
                )}
              </a>
            );
          })}
        </motion.div>

        {/* Auth Buttons */}
        <motion.div layout className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-4">
          <AnimatePresence>
            {!scrolled && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden lg:block overflow-hidden"
              >
                <Button variant="ghost" className="text-white/70 hover:bg-white/10 hover:text-white rounded-full px-5 text-sm font-medium h-9" onClick={onLoginClick}>
                  Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div layout whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className={`bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.3)] rounded-full text-sm font-semibold transition-all ${scrolled ? 'px-4 h-8' : 'px-6 h-9'}`} onClick={onRegisterClick}>
              Join
            </Button>
          </motion.div>
        </motion.div>

      </motion.nav>
    </div>
  );
}
