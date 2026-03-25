import React, { Suspense, lazy } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const Login = lazy(() => import('./components/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./components/Register').then((m) => ({ default: m.Register })));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="fixed inset-0 bg-[#030303] flex items-center justify-center z-[200]">
          <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      }>
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
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
