import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons';
import Grainient from './ui/Grainient';

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1 State
  const [email, setEmail] = useState('');
  
  // Step 2 State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };
  
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!otp || !newPassword || newPassword !== confirmPassword) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09090b] px-4 overflow-hidden"
    >
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

      <div className="relative z-10 w-full max-w-[480px]">
        <button 
          onClick={() => navigate('/login')}
          className="text-white/70 hover:text-white flex items-center gap-2 text-sm transition-colors mb-6 font-medium"
        >
          <FontAwesomeIcon icon={faArrowLeft} /> Back to sign in
        </button>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-[#2c2638] rounded-[1.5rem] p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5"
        >
          {step === 1 ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Reset your password</h1>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white block">Email address</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82818A]">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <input 
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg pl-11 pr-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#A855F7] hover:bg-[#b571fa] disabled:opacity-60 disabled:hover:bg-[#A855F7] text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(168,85,247,0.4)]"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-white/50">
                  Remember your password?{' '}
                  <button onClick={() => navigate('/login')} className="text-[#A855F7] hover:underline font-medium">
                    Sign in instead
                  </button>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Verify and reset password</h1>
              <p className="text-white/60 text-sm mb-8 leading-relaxed">
                Enter the OTP sent to <span className="text-white font-medium">{email}</span> and create a new password.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white block">OTP</label>
                  <input 
                    type="text"
                    required
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg px-4 py-3.5 text-center tracking-[0.5em] text-lg text-white focus:outline-none transition-all placeholder:text-[#82818A]"
                  />
                  <p className="text-xs text-white/40 mt-1">Enter the 6-digit code sent to your email</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white block">New password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82818A]">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <input 
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Create a strong password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg pl-11 pr-12 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#82818A] hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white block">Confirm password</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82818A]">
                      <FontAwesomeIcon icon={faLock} />
                    </div>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg pl-11 pr-12 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#82818A] hover:text-white transition-colors"
                    >
                      <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otp || !newPassword || newPassword !== confirmPassword}
                  className="w-full bg-[#A855F7] hover:bg-[#b571fa] disabled:opacity-60 disabled:hover:bg-[#A855F7] text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(168,85,247,0.4)] mt-4"
                >
                  {loading ? 'Resetting...' : 'Reset password'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-sm text-white/50">
                  Didn't receive the OTP?{' '}
                  <button onClick={handleSendOTP} disabled={loading} className="text-[#A855F7] hover:underline font-medium">
                    Resend code
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
