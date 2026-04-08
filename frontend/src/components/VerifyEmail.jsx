import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faEnvelope, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import Grainient from './ui/Grainient';
import { registerRequest, sendRegistrationOtpRequest, setAccessToken } from '@/lib/api';

/**
 * Post-registration email verification page.
 * User enters the 6-digit OTP sent to their email.
 * Features: 60-second resend timer, max 2 wrong attempts, success redirect.
 */
export function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';
  
  const location = useLocation();
  const { registrationData, regRole } = location.state || {};

  const [step, setStep] = useState('otp'); // 'otp' | 'success'
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  // Resend timer
  const [resendTimer, setResendTimer] = useState(60);
  const [resendLoading, setResendLoading] = useState(false);

  const startResendTimer = useCallback(() => {
    setResendTimer(60);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    otpRefs.current[0]?.focus();
  }, []);

  // ─── OTP Handlers ──────────────────────────────────────────────────────────

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      const chars = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      chars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(index + chars.length, 5);
      otpRefs.current[nextIdx]?.focus();
      return;
    }
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const otpString = otp.join('');

  const handleVerify = async () => {
    setError('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }
    if (!emailFromQuery) {
      setError('Email not found. Please go back and register again.');
      return;
    }
    if (!registrationData || !regRole) {
      setError('Registration session expired. Please go back and register again.');
      return;
    }
    setLoading(true);
    try {
      const data = await registerRequest(regRole, { ...registrationData, otp: otpString });
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      setStep('success');
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!emailFromQuery) {
      setError('Email not found. Please go back and register again.');
      return;
    }
    setResendLoading(true);
    setError('');
    try {
      await sendRegistrationOtpRequest(emailFromQuery);
      startResendTimer();
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#09090b] overflow-hidden"
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

      <div className="relative z-10 w-[95%] max-w-[480px]">
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to sign in
        </Link>

        <AnimatePresence mode="wait">
          {/* ─── OTP STEP ────────────────────────────────────────────────── */}
          {step === 'otp' && (
            <motion.div
              key="verify-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-[#2c2638]/80 backdrop-blur-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#6B21A8]/10 border border-[#6B21A8]/20 mb-5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#A855F7] text-xl" />
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight text-center">Verify your email</h1>
              <p className="mt-2 text-sm text-[#a1a1aa] leading-6 text-center">
                We've sent a 6-digit verification code to{' '}
                <strong className="text-white">{emailFromQuery || 'your email'}</strong>.
                Enter it below to complete your registration.
              </p>

              {error ? <div className="mt-4 text-sm text-red-400 text-center">{error}</div> : null}

              {/* OTP Boxes */}
              <div className="mt-6">
                <label className="text-sm font-medium text-white/80 block mb-2 text-center">Verification code</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => { otpRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                        handleOtpChange(0, pasted);
                      }}
                      className="w-12 h-14 text-center text-xl font-bold bg-[#36353E] border border-white/10 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg text-white focus:outline-none transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading || otpString.length !== 6}
                className="mt-6 w-full bg-[#6B21A8] hover:bg-[#832bc9] disabled:opacity-60 text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
              >
                {loading ? 'Verifying…' : 'Verify email'}
              </button>



              {/* Resend */}
              <p className="mt-4 text-center text-sm text-[#a1a1aa]">
                {"Didn't receive the code? "}
                {resendTimer > 0 ? (
                  <span className="text-[#82818A]">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-[#A855F7] hover:underline font-medium disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending…' : 'Resend code'}
                  </button>
                )}
              </p>
            </motion.div>
          )}

          {/* ─── SUCCESS STEP ────────────────────────────────────────────── */}
          {step === 'success' && (
            <motion.div
              key="success-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-[#2c2638]/80 backdrop-blur-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <FontAwesomeIcon icon={faCheck} className="text-green-400 text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Email verified!</h1>
              <p className="mt-3 text-sm text-[#a1a1aa] leading-6">
                Your email has been verified successfully. You now have full access to the Alumni Sangham network.
              </p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-6 w-full bg-[#6B21A8] hover:bg-[#832bc9] text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
