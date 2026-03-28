import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Grainient from './ui/Grainient';
import { loginRequest, setAccessToken } from '@/lib/api';

export function Login({ onBack }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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

      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-[95%] max-w-[1100px] h-[650px] flex rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 bg-[#2c2638] p-3 md:p-4"
      >
        <div className="hidden md:flex w-1/2 relative bg-black flex-col justify-between p-8 rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-screen"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1549480017-d773068e594d?q=80&w=2674&auto=format&fit=crop")',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2c2638]/30 via-transparent to-[#09090b]/90 mix-blend-multiply" />

          <div className="relative z-10 flex justify-between items-center w-full">
            <h1 className="text-3xl font-black tracking-widest text-white drop-shadow-lg" style={{ fontFamily: 'sans-serif' }}>
              ΛMU
            </h1>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all shadow-lg border border-white/10"
            >
              Back to website <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="relative z-10 mb-8 flex flex-col items-center text-center w-full text-white">
            <h2 className="text-3xl font-medium tracking-tight mb-8 drop-shadow-md leading-tight">
              Capturing Moments,
              <br />
              Creating Memories
            </h2>
            <div className="flex gap-2.5">
              <div className="w-6 h-1 bg-white/30 rounded-full transition-all" />
              <div className="w-6 h-1 bg-white/30 rounded-full transition-all" />
              <div className="w-8 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all" />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 bg-[#2c2638] flex flex-col px-10 md:px-14 pt-8 pb-12 relative z-10 rounded-2xl">
          <div className="flex items-center w-full border-b border-white/5">
            <button
              type="button"
              onClick={() => navigate('/login/student')}
              className={`flex-1 relative pb-3 text-lg md:text-xl tracking-wide transition-all duration-300 ${activeTab === 'student' ? 'text-white font-bold drop-shadow-md' : 'text-white/50 font-medium hover:text-white/80'}`}
            >
              Student
              {activeTab === 'student' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,1)] rounded-full"
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/login/alumni')}
              className={`flex-1 relative pb-3 text-lg md:text-xl tracking-wide transition-all duration-300 ${activeTab === 'alumni' ? 'text-white font-bold drop-shadow-md' : 'text-white/50 font-medium hover:text-white/80'}`}
            >
              Alumni
              {activeTab === 'alumni' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,1)] rounded-full"
                />
              )}
            </button>
          </div>

          <div className="w-full mt-auto mb-auto">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">Log in</h2>
            <p className="text-[#a1a1aa] mb-8 text-sm">
              Don&apos;t have an account?{' '}
              <Link to={`/register/${activeTab}`} className="text-[#A855F7] cursor-pointer hover:underline font-medium">
                Sign up
              </Link>
            </p>

            {error ? <div className="mb-4 text-sm text-red-400">{error}</div> : null}

            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
              <div className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full bg-[#36353E] border border-white/5 focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7]/50 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none transition-all placeholder:text-[#82818A]"
                />
              </div>

              <div className="w-full relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

              <div className="flex justify-between items-center mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-[#82818A] group-hover:border-[#A855F7] bg-[#36353E] flex items-center justify-center transition-colors">
                    <input type="checkbox" className="opacity-0 absolute w-4 h-4 cursor-pointer" />
                  </div>
                  <span className="text-xs text-[#a1a1aa] group-hover:text-white transition-colors">Remember me</span>
                </label>

                <span className="text-xs text-[#A855F7] font-medium">Forgot password?</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-[#6B21A8] hover:bg-[#832bc9] disabled:opacity-60 text-white rounded-lg py-3.5 font-semibold text-sm transition-all shadow-[0_4px_14px_rgba(107,33,168,0.4)]"
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
