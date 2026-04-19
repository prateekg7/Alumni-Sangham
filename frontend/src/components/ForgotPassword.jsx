import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowLeft, faEnvelope, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { forgotPasswordRequest, verifyResetOtpRequest, resetPasswordRequest } from '@/lib/api';
import loginBackground from '../assets/auth/login.jpg';

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
    'w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3.5 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#1a1015]"
    >
      <img
        src={loginBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 z-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 18%' }}
      />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,248,238,0.08),rgba(38,23,32,0.72))]" />

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
          {/* ─── STEP 1: EMAIL ───────────────────────────────────────────── */}
          {step === 'email' && (
            <motion.div
              key="email-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-semibold tracking-tight text-[#201317]" style={{ fontFamily: 'Syne, sans-serif' }}>Reset your password</h1>
              <p className="mt-2 text-sm text-[#6e5560] leading-6">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>

              {emailError ? <div className="mt-4 text-sm text-red-500">{emailError}</div> : null}

              <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-[#24181e] block mb-1.5">Email address</label>
                  <div className="relative">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b737d] text-sm"
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
                  className="w-full rounded-xl bg-[#e8528d] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682] disabled:opacity-60"
                >
                  {emailLoading ? 'Sending OTP…' : 'Send OTP'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-[#6e5560]">
                Remember your password?{' '}
                <Link to="/login" className="text-[#d74682] hover:underline font-medium">
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
            >
              <h1 className="text-3xl font-semibold tracking-tight text-[#201317]" style={{ fontFamily: 'Syne, sans-serif' }}>
                {otpVerified ? 'Set new password' : 'Verify OTP'}
              </h1>
              <p className="mt-2 text-sm text-[#6e5560] leading-6">
                {otpVerified ? (
                  <>OTP verified! Now create a new password for <strong className="text-[#201317]">{email}</strong>.</>
                ) : (
                  <>Enter the OTP sent to <strong className="text-[#201317]">{email}</strong>.</>
                )}
              </p>

              {otpError ? <div className="mt-4 text-sm text-red-500">{otpError}</div> : null}

              {/* OTP Boxes */}
              {!otpVerified && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-[#24181e] block mb-1.5">OTP</label>
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
                  <p className="mt-2 text-xs text-[#8b737d] text-center">Enter the 6-digit code sent to your email</p>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otpString.length !== 6}
                    className="mt-6 w-full rounded-xl bg-[#e8528d] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682] disabled:opacity-60"
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
                      <FontAwesomeIcon icon={faCheck} className="text-green-600 text-sm" />
                      <span className="text-sm text-green-700 font-medium">OTP verified successfully</span>
                    </div>

                    {resetError ? <div className="text-sm text-red-500">{resetError}</div> : null}

                    <div>
                      <label className="text-sm font-medium text-[#24181e] block mb-1.5">New password</label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b737d] text-sm"
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b737d] hover:text-[#2c1e24] transition-colors"
                        >
                          <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>

                    {/* Dynamic password requirements UI */}
                    <div className="mt-2 space-y-1">
                      <div className={`text-xs ${reqs.length ? 'text-green-600' : 'text-[#8b737d]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.length ? 'opacity-100' : 'opacity-0'}`} />
                        At least 8 characters
                      </div>
                      <div className={`text-xs ${reqs.upper ? 'text-green-600' : 'text-[#8b737d]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.upper ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 uppercase letter
                      </div>
                      <div className={`text-xs ${reqs.lower ? 'text-green-600' : 'text-[#8b737d]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.lower ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 lowercase letter
                      </div>
                      <div className={`text-xs ${reqs.number ? 'text-green-600' : 'text-[#8b737d]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.number ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 number
                      </div>
                      <div className={`text-xs ${reqs.special ? 'text-green-600' : 'text-[#8b737d]'}`}>
                        <FontAwesomeIcon icon={faCheck} className={`mr-1.5 ${reqs.special ? 'opacity-100' : 'opacity-0'}`} />
                        At least 1 special character
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#24181e] block mb-1.5">Confirm password</label>
                      <div className="relative">
                        <FontAwesomeIcon
                          icon={faLock}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b737d] text-sm"
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
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b737d] hover:text-[#2c1e24] transition-colors"
                        >
                          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={resetLoading || !meetsAll}
                      className="w-full rounded-xl bg-[#e8528d] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682] disabled:opacity-60"
                    >
                      {resetLoading ? 'Resetting…' : 'Reset password'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Resend OTP */}
              {!otpVerified && (
                <p className="mt-6 text-center text-sm text-[#6e5560]">
                  {"Didn't receive the OTP? "}
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
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
