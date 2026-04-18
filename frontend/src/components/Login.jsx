import React, { useState } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { loginRequest, setAccessToken } from '@/lib/api';
import { AuthShowcase } from './AuthShowcase';
import loginBackground from '../assets/auth/login.jpg';
import l1 from '../assets/auth/l1.jpg';
import l2 from '../assets/auth/l2.jpg';
import l3 from '../assets/auth/l3.jpg';

const loginSlides = [
  { src: l1, alt: 'Campus building reflection' },
  { src: l2, alt: 'IIT Patna main gate' },
  { src: l3, alt: 'Campus architecture close view' },
];

export function Login({ onBack }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.type === 'error' ? location.state.message : '');
  const [successMsg, setSuccessMsg] = useState(location.state?.type === 'success' ? location.state.message : '');

  // Clear messages on input change
  const handleInputChange = () => {
    if (error) setError('');
    if (successMsg) {
      setSuccessMsg('');
      // Clean up history state so refresh doesn't show it again
      navigate(location.pathname, { replace: true, state: {} });
    }
  };

  const [loading, setLoading] = useState(false);

  const activeTab = role === 'alumni' ? 'alumni' : 'student';
  const expectedRole = activeTab;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginRequest({ email: email.trim(), password, expectedRole });
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

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
        className="relative z-10 flex w-[95%] max-w-[1120px] flex-col rounded-[2rem] border border-white/30 bg-white/14 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:h-[680px] md:flex-row md:p-4"
      >
        <div className="relative hidden w-[44%] md:block">
          <div className="absolute right-6 top-6 z-20">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border border-white/35 bg-white/18 px-4 py-1.5 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/28"
            >
              Back to website <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          <AuthShowcase
            slides={loginSlides}
            accentColor="#e8528d"
            fullBleed
          />
        </div>

        <div className="relative z-10 flex w-full flex-col rounded-[1.7rem] border border-white/35 bg-[rgba(255,255,255,0.72)] px-8 pb-10 pt-8 backdrop-blur-xl md:w-[56%] md:px-12 md:pb-12 md:pt-9">
          <div className="mb-6 flex justify-end md:hidden">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border border-[#e4b8c8]/70 bg-white/60 px-4 py-1.5 text-xs font-semibold text-[#5a3949] transition-all hover:bg-white/80"
            >
              Back to website <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="flex items-center w-full border-b border-[#e6ced8]">
            <button
              type="button"
              onClick={() => navigate('/login/student')}
              className={`relative flex-1 pb-3 text-lg tracking-wide transition-all duration-300 md:text-xl ${activeTab === 'student' ? 'font-bold text-[#201317]' : 'font-medium text-[#7f6470] hover:text-[#4c3740]'}`}
            >
              Student
              {activeTab === 'student' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-full bg-[#e8528d] shadow-[0_0_12px_rgba(232,82,141,0.55)]"
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/login/alumni')}
              className={`relative flex-1 pb-3 text-lg tracking-wide transition-all duration-300 md:text-xl ${activeTab === 'alumni' ? 'font-bold text-[#201317]' : 'font-medium text-[#7f6470] hover:text-[#4c3740]'}`}
            >
              Alumni
              {activeTab === 'alumni' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-full bg-[#e8528d] shadow-[0_0_12px_rgba(232,82,141,0.55)]"
                />
              )}
            </button>
          </div>

          <div className="mb-auto mt-auto w-full">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-[#201317] md:text-4xl" style={{ fontFamily: 'Syne, sans-serif' }}>
              Log in
            </h2>
            <p className="mb-8 text-sm text-[#6e5560]">
              Don&apos;t have an account?{' '}
              <Link to={`/register/${activeTab}`} className="cursor-pointer font-medium text-[#d74682] hover:underline">
                Sign up
              </Link>
            </p>

            {error ? (
              <div className="mb-4 text-sm text-red-500">
                {error}
                {error.includes('before logging in') && email ? (
                  <Link
                    to={`/verify-email?email=${encodeURIComponent(email.trim())}`}
                    className="ml-2 font-medium text-[#d74682] hover:underline"
                  >
                    Verify now
                  </Link>
                ) : null}
              </div>
            ) : null}
            {successMsg ? <div className="mb-4 text-sm text-green-600">{successMsg}</div> : null}

            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); handleInputChange(); }}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3.5 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                />
              </div>

              <div className="w-full relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); handleInputChange(); }}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3.5 pr-12 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-2 text-[#8b737d] transition-colors hover:text-[#2c1e24]"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>

              <div className="flex justify-between items-center mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer rounded border-[#b18a99] bg-white/55 accent-[#e8528d]"
                    style={{ accentColor: '#e8528d' }}
                  />
                  <span className="text-xs text-[#6e5560] transition-colors group-hover:text-[#2d1f25]">Remember me</span>
                </label>

                <Link to="/forgot-password" className="text-xs font-medium text-[#d74682] hover:underline">Forgot password?</Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#e8528d] py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682] disabled:opacity-60"
              >
                {loading ? 'Signing in…' : 'Log in'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
