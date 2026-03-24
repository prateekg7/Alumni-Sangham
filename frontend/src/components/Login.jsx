import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Grainient from './ui/Grainient';

export function Login({ onBack }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09090b] overflow-hidden"
    >
      {/* Global Background Grainient */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Grainient
          color1="#360044"
          color2="#1a0022"
          color3="#4f0066"
          timeSpeed={0.8}
          colorBalance={0}
          warpStrength={1.5}
          warpFrequency={2.5}
          warpSpeed={1.5}
          warpAmplitude={60}
          blendAngle={0}
          blendSoftness={0.1}
          rotationAmount={300}
          noiseScale={2.5}
          grainAmount={0.15}
          grainScale={1.5}
          grainAnimated={true}
          contrast={1.3}
          gamma={1.1}
          saturation={1.2}
          centerX={0}
          centerY={0}
          zoom={1}
        />
      </div>

      {/* Main Card Container */}
      <motion.div 
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-[95%] max-w-[1100px] h-[650px] flex rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 bg-[#2c2638] p-3 md:p-4"
      >
        
        {/* Left Side: Branding & Image Placeholder */}
        <div className="hidden md:flex w-1/2 relative bg-black flex-col justify-between p-8 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          {/* Desert Dune Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-screen"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1549480017-d773068e594d?q=80&w=2674&auto=format&fit=crop")' }}
          />
          {/* Subtle purple gradient overlay for the image */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2c2638]/30 via-transparent to-[#09090b]/90 mix-blend-multiply" />

          {/* Top Header */}
          <div className="relative z-10 flex justify-between items-center w-full">
            <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-lg" style={{ fontFamily: 'sans-serif' }}>
              ΛMU
            </h1>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all shadow-lg border border-white/10"
            >
              Back to website <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 mb-8 flex flex-col items-center text-center w-full text-white">
            <h2 className="text-3xl font-medium tracking-tight mb-8 drop-shadow-md leading-tight">
              Capturing Moments,<br/>Creating Memories
            </h2>
            {/* Carousel Dots */}
            <div className="flex gap-2.5">
              <div className="w-6 h-1 bg-white/30 rounded-full transition-all"></div>
              <div className="w-6 h-1 bg-white/30 rounded-full transition-all"></div>
              <div className="w-8 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 bg-[#2c2638] flex flex-col justify-center px-10 md:px-14 py-12 relative z-10 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">Log in</h2>
          <p className="text-[#a1a1aa] mb-10 text-sm">
            Don't have an account? <span className="text-[#A855F7] cursor-pointer hover:underline font-medium">Sign up</span>
          </p>

          <form className="flex flex-col gap-5 w-full">
            {/* Email */}
            <div className="w-full">
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A]"
              />
            </div>

            {/* Password */}
            <div className="w-full relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password" 
                className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A] pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#82818A] hover:text-white transition-colors p-1 flex items-center justify-center p-2 rounded-md"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-[#82818A] group-hover:border-[#A855F7] bg-[#36353E] flex items-center justify-center transition-colors">
                  <input type="checkbox" className="opacity-0 absolute w-4 h-4 cursor-pointer" />
                </div>
                <span className="text-xs text-[#a1a1aa] group-hover:text-white transition-colors">Remember me</span>
              </label>
              
              <a href="#" className="text-xs text-[#A855F7] hover:text-white transition-colors font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="button"
              className="mt-4 w-full bg-[#6B21A8] hover:bg-[#832bc9] text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
            >
              Log in
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
