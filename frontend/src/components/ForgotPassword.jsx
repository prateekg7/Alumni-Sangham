import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft, faEnvelope, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import Grainient from './ui/Grainient';
import { forgotPasswordRequest, verifyResetOtpRequest, resetPasswordRequest } from '@/lib/api';

/**
 * Multi-step forgot-password page:
 * Step 1: Enter email → Send OTP
 * Step 2: Enter OTP → Validate OTP → (on success) show new password fields → Reset password
 * Step 3: Success — redirect to login
 */
export function ForgotPassword() {
  const navigate = useNavigate();

  // Steps: 'email' | 'otp' | 'success'
  const [step, setStep] = useState('email');

  // Step 1
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Step 2 — OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef([]);

  // Step 2 — Password (appears after OTP verified)
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');

  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);

  // Start 60s timer
  const startResendTimer = useCallback(() => {
    setResendTimer(60);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ─── Step 1: Send OTP ──────────────────────────────────────────────────────

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError('');
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }
    setEmailLoading(true);
    try {
      await forgotPasswordRequest(email.trim());
      setStep('otp');
      startResendTimer();
    } catch (err) {
      if (err?.status === 429 || err?.status === 404) {
        setEmailError(err.message);
      } else {
        // Only ignore specific generic errors, or display others?
        // Let's just catch 404 so our new error message shows.
        setStep('otp');
        startResendTimer();
      }
    } finally {
      setEmailLoading(false);
    }
  };

  // ─── OTP Input Handlers ────────────────────────────────────────────────────

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
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

  // ─── Step 2a: Validate OTP ─────────────────────────────────────────────────

  const otpString = otp.join('');

  const handleVerifyOtp = async () => {
    setOtpError('');
    if (otpString.length !== 6) {
      setOtpError('Please enter the complete 6-digit OTP');
      return;
    }
    setOtpLoading(true);
    try {
      const data = await verifyResetOtpRequest(email.trim(), otpString);
      setResetToken(data.resetToken);
      setOtpVerified(true);
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  // ─── Step 2b: Reset Password ───────────────────────────────────────────────

  const reqs = {
    length: newPassword.length >= 8,
    upper: /[A-Z]/.test(newPassword),
    lower: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };
  const meetsAll = Object.values(reqs).every(Boolean);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetError('');
    if (!meetsAll) {
      setResetError('Please ensure your password meets all requirements');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError('Passwords do not match');
      return;
    }
    setResetLoading(true);
    try {
      await resetPasswordRequest(resetToken, newPassword);
      navigate('/login', { state: { message: 'Password reset successful. Please log in with your new password.', type: 'success' }, replace: true });
    } catch (err) {
      const msg = err.message || 'Failed to reset password';
      const extra = Array.isArray(err.errors) && err.errors.length ? ` ${err.errors.join('; ')}` : '';
      setResetError(`${msg}${extra}`);
    } finally {
      setResetLoading(false);
    }
  };

  // ─── Resend OTP ────────────────────────────────────────────────────────────

  const handleResendOtp = async () => {
    setResendLoading(true);
    setOtpError('');
    try {
      await forgotPasswordRequest(email.trim());
      startResendTimer();
      setOtp(['', '', '', '', '', '']);
      setOtpVerified(false);
      setResetToken('');
    } catch (err) {
      setOtpError(err.message || 'Could not resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const inputClass =
    'w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A]';

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
          {/* ─── STEP 1: EMAIL ───────────────────────────────────────────── */}
          {step === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-[#2c2638]/80 backdrop-blur-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">Reset your password</h1>
              <p className="mt-2 text-sm text-[#a1a1aa] leading-6">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

              {emailError ? <div className="mt-4 text-sm text-red-400">{emailError}</div> : null}

              <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-white/80 block mb-1.5">Email address</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82818A] text-sm"
                    />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full bg-[#6B21A8] hover:bg-[#832bc9] disabled:opacity-60 text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
                >
                  {emailLoading ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#a1a1aa]">
                Remember your password?{' '}
                <Link to="/login" className="text-[#A855F7] hover:underline font-medium">
                  Sign in instead
                </Link>
              </p>
            </motion.div>
          )}

          {/* ─── STEP 2: OTP + NEW PASSWORD ──────────────────────────────── */}
          {step === 'otp' && (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-white/10 bg-[#2c2638]/80 backdrop-blur-xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
            >
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {otpVerified ? 'Set new password' : 'Verify OTP'}
              </h1>
              <p className="mt-2 text-sm text-[#a1a1aa] leading-6">
                {otpVerified ? (
                  <>OTP verified! Now create a new password for <strong className="text-white">{email}</strong>.</>
                ) : (
                  <>Enter the OTP sent to <strong className="text-white">{email}</strong>.</>
                )}
              </p>

              {otpError ? <div className="mt-4 text-sm text-red-400">{otpError}</div> : null}

              {/* OTP Boxes */}
              {!otpVerified && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-white/80 block mb-1.5">OTP</label>
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
                  <p className="mt-2 text-xs text-[#82818A]">Enter the 6-digit code sent to your email</p>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otpString.length !== 6}
                    className="mt-4 w-full bg-[#6B21A8] hover:bg-[#832bc9] disabled:opacity-60 text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
                  >
                    {otpLoading ? 'Verifying…' : 'Validate OTP'}
                  </button>
                </div>
              )}

              {/* Password fields — appear after OTP is verified */}
              <AnimatePresence>
                {otpVerified && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleResetPassword}
                    className="mt-6 space-y-4 overflow-hidden"
                  >
                    {/* OTP verified badge */}
                    <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2.5">
                      <FontAwesomeIcon icon={faCheck} className="text-green-400 text-sm" />
                      <span className="text-sm text-green-300 font-medium">OTP verified successfully</span>
                    </div>

                    {resetError ? <div className="text-sm text-red-400">{resetError}</div> : null}

                    <div>
                      <label className="text-sm font-medium text-white/80 block mb-1.5">New password</label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82818A] text-sm"
                        />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                          className={`${inputClass} pl-11 pr-12`}
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

                    {/* Dynamic password requirements UI */}
                    <div className="mt-2 space-y-1">
                      <div className={`text-xs ${reqs.length ? 'text-green-400' : 'text-[#82818A]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.length ? 'opacity-100' : 'opacity-0'}`} />
                        At least 8 characters
                      </div>
                      <div className={`text-xs ${reqs.upper ? 'text-green-400' : 'text-[#82818A]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.upper ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 uppercase letter
                      </div>
                      <div className={`text-xs ${reqs.lower ? 'text-green-400' : 'text-[#82818A]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.lower ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 lowercase letter
                      </div>
                      <div className={`text-xs ${reqs.number ? 'text-green-400' : 'text-[#82818A]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.number ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 number
                      </div>
                      <div className={`text-xs ${reqs.special ? 'text-green-400' : 'text-[#82818A]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.special ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 special character
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-white/80 block mb-1.5">Confirm password</label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#82818A] text-sm"
                        />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          autoComplete="new-password"
                          className={`${inputClass} pl-11 pr-12`}
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
                      disabled={resetLoading || !meetsAll}
                      className="w-full bg-[#6B21A8] hover:bg-[#832bc9] disabled:opacity-60 text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
                    >
                      {resetLoading ? 'Resetting…' : 'Reset password'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Resend OTP */}
              <p className="mt-6 text-center text-sm text-[#a1a1aa]">
                {"Didn't receive the OTP? "}
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
