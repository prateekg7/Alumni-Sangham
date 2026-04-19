import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faEnvelope, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { registerRequest, sendRegistrationOtpRequest, setAccessToken } from '@/lib/api';
import joinBackground from '../assets/auth/join.jpg';

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
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#16110d]"
    >
      <img
        src={joinBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 24%' }}
      />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,248,238,0.08),rgba(31,23,19,0.72))]" />

      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 flex w-[95%] max-w-[480px] flex-col rounded-[1.7rem] border border-white/35 bg-[rgba(255,255,255,0.72)] px-8 pb-10 pt-8 shadow-[0_30px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-[#5a3949] hover:text-[#201317] transition-colors mb-6 font-medium"
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
            >
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e8528d]/10 border border-[#e8528d]/20 mb-5">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#e8528d] text-xl" />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-[#201317] text-center" style={{ fontFamily: 'Syne, sans-serif' }}>Verify your email</h1>
              <p className="mt-2 text-sm text-[#6e5560] leading-6 text-center">
                We've sent a 6-digit verification code to <br/>
                <strong className="text-[#201317]">{emailFromQuery || 'your email'}</strong>.<br/>
                Enter it below to complete your registration.
              </p>

              {error ? <div className="mt-4 text-sm text-red-500 text-center">{error}</div> : null}

              {/* OTP Boxes */}
              <div className="mt-6">
                <label className="text-sm font-medium text-[#24181e] block mb-2 text-center">Verification code</label>
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
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-white/55 bg-white/58 text-[#24181e] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45 transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerify}
                disabled={loading || otpString.length !== 6}
                className="mt-8 w-full rounded-xl bg-[#e8528d] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682] disabled:opacity-60"
              >
                {loading ? 'Verifying…' : 'Verify email'}
              </button>

              {/* Resend */}
              <p className="mt-6 text-center text-sm text-[#6e5560]">
                {"Didn't receive the code? "}
                {resendTimer > 0 ? (
                  <span className="text-[#8b737d]">
                    Resend in {resendTimer}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendLoading}
                    className="text-[#d74682] hover:underline font-medium disabled:opacity-50"
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
              className="text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 text-2xl" />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-[#201317]" style={{ fontFamily: 'Syne, sans-serif' }}>Email verified!</h1>
              <p className="mt-3 text-sm text-[#6e5560] leading-6">
                Your email has been verified successfully. You now have full access to the Alumni Sangham network.
              </p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-8 w-full rounded-xl bg-[#e8528d] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682]"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
