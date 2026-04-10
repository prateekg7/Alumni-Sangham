import React, { Suspense, lazy } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const Login = lazy(() => import('./components/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./components/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./components/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const VerifyEmail = lazy(() => import('./components/VerifyEmail').then((m) => ({ default: m.VerifyEmail })));
const AuthenticatedLayout = lazy(() =>
  import('./layouts/AuthenticatedLayout').then((m) => ({ default: m.AuthenticatedLayout })),
);
const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const DirectoryPage = lazy(() =>
  import('./pages/AuthenticatedPages').then((m) => ({ default: m.DirectoryPage })),
);
const BlogsPage = lazy(() =>
  import('./pages/BlogsPage').then((m) => ({ default: m.BlogsPage })),
);
const BlogDetailPage = lazy(() =>
  import('./pages/BlogsPage').then((m) => ({ default: m.BlogDetailPage })),
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);

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
          location.pathname.startsWith('/register') ? 'register' :
          location.pathname.startsWith('/forgot-password') ? 'forgot-password' :
          location.pathname.startsWith('/verify-email') ? 'verify-email' : location.pathname
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Navigate to="/login/student" replace />} />
          <Route path="/login/:role" element={<Login onBack={() => navigate('/')} />} />
          <Route path="/register" element={<Navigate to="/register/student" replace />} />
          <Route path="/register/:role" element={<Register onBack={() => navigate('/')} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/blog" element={<BlogsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/profile/me" element={<ProfilePage />} />
            <Route path="/profile/:profileId" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
