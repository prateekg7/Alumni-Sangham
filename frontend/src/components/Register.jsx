import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { sendRegistrationOtpRequest } from '@/lib/api';
import { AuthShowcase } from './AuthShowcase';
import { CompanyAutocomplete } from './ui/CompanyAutocomplete';
import joinBackground from '../assets/auth/join.jpg';
import j1 from '../assets/auth/j1.jpg';
import j2 from '../assets/auth/j2.jpg';
import j3 from '../assets/auth/j3.jpg';
import { DepartmentDropdown } from './ui/DepartmentDropdown';

const registerSlides = [
  { src: j1, alt: 'Students gathered outside campus building' },
  { src: j2, alt: 'Campus walkway and architecture' },
  { src: j3, alt: 'Campus memory capture' },
];

export function Register({ onBack }) {
  const { role } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [expectedGradYear, setExpectedGradYear] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const activeTab = role === 'alumni' ? 'alumni' : 'student';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const regRole = activeTab;
      const body =
        activeTab === 'student'
          ? {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              password,
              phone: phone.trim(),
              department: department.trim(),
              expectedGradYear: expectedGradYear.trim(),
            }
          : {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              email: email.trim(),
              password,
              phone: phone.trim(),
              department: department.trim(),
              gradYear: gradYear.trim(),
              currentCompany: currentCompany.trim(),
            };

      await sendRegistrationOtpRequest(email.trim());
      // Redirect to email verification page, passing the registration data!
      navigate(`/verify-email?email=${encodeURIComponent(email.trim())}`, { 
        replace: true,
        state: { registrationData: body, regRole }
      });
    } catch (err) {
      const msg = err?.message || 'Registration failed';
      const extra = Array.isArray(err.errors) && err.errors.length ? ` ${err.errors.join('; ')}` : '';
      setError(`${msg}${extra}`);
    } finally {
      setLoading(false);
    }
  };

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
        className="relative z-10 flex w-[95%] max-w-[1120px] flex-col rounded-[2rem] border border-white/30 bg-white/14 p-3 shadow-[0_30px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl md:h-[700px] md:flex-row md:p-4"
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
            slides={registerSlides}
            accentColor="#e8528d"
            fullBleed
          />
        </div>

        <div className="relative z-10 flex max-h-[680px] w-full flex-col overflow-y-auto rounded-[1.7rem] border border-white/35 bg-[rgba(255,255,255,0.72)] px-8 pb-10 pt-8 backdrop-blur-xl md:max-h-none md:w-[56%] md:px-12 md:pb-12 md:pt-9">
          <div className="mb-6 flex justify-end md:hidden">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-full border border-[#e4b8c8]/70 bg-white/60 px-4 py-1.5 text-xs font-semibold text-[#5a3949] transition-all hover:bg-white/80"
            >
              Back to website <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div className="flex w-full shrink-0 items-center border-b border-[#e6ced8]">
            <button
              type="button"
              onClick={() => navigate('/register/student')}
              className={`relative flex-1 pb-3 text-lg tracking-wide transition-all duration-300 md:text-xl ${activeTab === 'student' ? 'font-bold text-[#201317]' : 'font-medium text-[#7f6470] hover:text-[#4c3740]'}`}
            >
              Student
              {activeTab === 'student' && (
                <motion.div
                  layoutId="activeTabUnderlineRegister"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-full bg-[#e8528d] shadow-[0_0_12px_rgba(232,82,141,0.55)]"
                />
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/register/alumni')}
              className={`relative flex-1 pb-3 text-lg tracking-wide transition-all duration-300 md:text-xl ${activeTab === 'alumni' ? 'font-bold text-[#201317]' : 'font-medium text-[#7f6470] hover:text-[#4c3740]'}`}
            >
              Alumni
              {activeTab === 'alumni' && (
                <motion.div
                  layoutId="activeTabUnderlineRegister"
                  className="absolute bottom-[-1px] left-0 right-0 h-[3px] rounded-full bg-[#e8528d] shadow-[0_0_12px_rgba(232,82,141,0.55)]"
                />
              )}
            </button>
          </div>

          <div className="w-full mt-auto mb-auto py-4">
            <h2 className="mb-2 text-3xl font-semibold tracking-tight text-[#201317] md:text-4xl" style={{ fontFamily: 'Syne, sans-serif' }}>
              Create an account
            </h2>
            <p className="mb-8 text-sm text-[#6e5560]">
              Already have an account?{' '}
              <Link to={`/login/${activeTab}`} className="cursor-pointer font-medium text-[#d74682] hover:underline">
                Log in
              </Link>
            </p>

            {error ? <div className="mb-4 text-sm text-red-500">{error}</div> : null}

            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
              <div className="flex gap-4 w-full">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="flex-1 rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="flex-1 rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                />
              </div>

              {activeTab === 'student' ? (
                <>
                  <input
                    type="email"
                    placeholder="University Email (.edu)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                  />
                  <div className="flex gap-4 w-full">
                    <DepartmentDropdown
                      value={department}
                      onChange={(val) => setDepartment(val)}
                      theme="light"
                    />
                    <input
                      type="text"
                      placeholder="Expected Grad Year"
                      value={expectedGradYear}
                      onChange={(e) => setExpectedGradYear(e.target.value)}
                      required
                      className="w-[140px] rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                  />
                </>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Personal or Work Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                  />
                  <div className="flex gap-4 w-full">
                    <DepartmentDropdown
                      value={department}
                      onChange={(val) => setDepartment(val)}
                      theme="light"
                    />
                    <input
                      type="text"
                      placeholder="Grad Year"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      required
                      className="w-[120px] rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                    />
                  </div>
                  <div className="flex gap-4 w-full">
                    <div className="flex-1">
                      <CompanyAutocomplete
                        value={currentCompany}
                        onChange={(val) => setCurrentCompany(val)}
                        theme="light"
                      />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-[150px] rounded-xl border border-white/55 bg-white/58 px-4 py-3 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                    />
                  </div>
                </>
              )}

              <div className="w-full relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/55 bg-white/58 px-4 py-3 pr-12 text-sm text-[#24181e] transition-all placeholder:text-[#8b737d] focus:border-[#e8528d] focus:outline-none focus:ring-1 focus:ring-[#e8528d]/45"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-[#8b737d] transition-colors hover:text-[#2c1e24]"
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
                  <span className="text-xs text-[#6e5560] transition-colors group-hover:text-[#2d1f25]">I agree to Terms & Conditions</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#e8528d] py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(232,82,141,0.24)] transition-all hover:bg-[#d74682] disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
