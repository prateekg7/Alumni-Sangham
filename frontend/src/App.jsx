import React from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PerspectiveGrid } from './components/ui/perspective-grid';
import Grainient from './components/ui/Grainient';
import { StatsSection } from './components/Stats';
import { ZoomParallax } from './components/ui/zoom-parallax';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AnimatePresence } from 'framer-motion';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-blue-500/30 dark pointer-events-none">
      <div className="fixed inset-0 z-0 bg-black pointer-events-auto">
        <Grainient
          color1="#203b46"
          color2="#0b171e"
          color3="#2b636e"
          timeSpeed={1}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={3.3}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
        {/* <PerspectiveGrid /> */}
      </div>
      <Navbar className="pointer-events-auto" onLoginClick={() => navigate('/login')} onRegisterClick={() => navigate('/register')} />
      <main className="relative z-10 pointer-events-none">
        <Hero />
        
        <StatsSection />

        {/* About Section */}
        <section id="about" className="min-h-screen w-full relative flex flex-col items-center justify-center px-6 py-24 pointer-events-none">
            <h2 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-10 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 pointer-events-auto">
              About Us
            </h2>
            <div className="max-w-4xl backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl text-center pointer-events-auto">
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
        </section>

        {/* Features Section - bento zoom parallax */}
        <section id="features" className="relative w-full">
            <ZoomParallax />
        </section>
        
        {/* Hall of Fame Section */}
        <section id="hall-of-fame" className="min-h-screen w-full relative flex items-center justify-center">
            {/* The zoom ends on the hall of fame section, kept empty for now */}
        </section>
      </main>
    </div>
  );
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={
        location.pathname.startsWith('/login') ? 'login' : 
        location.pathname.startsWith('/register') ? 'register' : location.pathname
      }>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Navigate to="/login/student" replace />} />
        <Route path="/login/:role" element={<Login onBack={() => navigate('/')} />} />
        <Route path="/register" element={<Navigate to="/register/student" replace />} />
        <Route path="/register/:role" element={<Register onBack={() => navigate('/')} />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
