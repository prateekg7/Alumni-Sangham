import React, { Suspense, lazy, startTransition, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { StatsSection } from '../components/Stats';

const Grainient = lazy(() => import('../components/ui/Grainient'));
const AboutUs = lazy(() => import('../components/AboutUs').then((m) => ({ default: m.AboutUs })));
const LandingFeaturesSection = lazy(() =>
  import('../components/LandingFeaturesSection').then((m) => ({
    default: m.LandingFeaturesSection,
  })),
);
const LandingHallOfFame = lazy(() =>
  import('../components/LandingHallOfFame').then((m) => ({ default: m.LandingHallOfFame })),
);
const StickyFooter = lazy(() =>
  import('../components/ui/sticky-footer').then((m) => ({ default: m.StickyFooter })),
);

function scheduleIdle(callback) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 500 });
  }

  return window.setTimeout(callback, 250);
}

function cancelIdle(id) {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
}

function DeferredSection({ id, placeholderClassName, rootMargin, className, children }) {
  const sectionRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || !sectionRef.current) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        observer.disconnect();
        startTransition(() => setShouldRender(true));
      },
      { rootMargin },
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div id={id} ref={sectionRef} className={`relative w-full ${className || ''}`}>
      {shouldRender ? children : <div className={placeholderClassName} aria-hidden="true" />}
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const idleId = scheduleIdle(() => {
      startTransition(() => setShowBackground(true));
    });

    return () => cancelIdle(idleId);
  }, []);

  useEffect(() => {
    const raw = (location.hash || '').replace(/^#/, '');
    if (!raw) {
      return undefined;
    }
    const t = window.setTimeout(() => {
      const el = document.getElementById(raw);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.hash, location.key]);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-blue-500/30 dark pointer-events-none">
      <div className="fixed inset-0 z-0 bg-zinc-900 pointer-events-auto">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(43,99,110,0.38),_transparent_45%),linear-gradient(180deg,_rgba(24,24,27,0.82)_0%,_rgba(9,9,11,0.9)_100%)]" />
        <div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.08)_1px,_transparent_0)] bg-[length:20px_20px]" />
        {showBackground ? (
          <Suspense fallback={null}>
            <Grainient
              color1="#203b46"
              color2="#0b171e"
              color3="#2b636e"
              timeSpeed={1}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={3.3}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.1}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          </Suspense>
        ) : null}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>
      <Navbar
        className="pointer-events-auto"
        onLoginClick={() => navigate('/login')}
        onRegisterClick={() => navigate('/register')}
      />
      <main className="relative z-10 pointer-events-none">
        <Hero />
        <StatsSection />
        <DeferredSection
          id="about"
          className="scroll-mt-28"
          rootMargin="400px 0px"
          placeholderClassName="min-h-screen md:min-h-[1100px] bg-transparent"
        >
          <Suspense
            fallback={
              <div
                className="min-h-screen md:min-h-[1100px] bg-transparent"
                aria-hidden="true"
              />
            }
          >
            <AboutUs sectionId={null} />
          </Suspense>
        </DeferredSection>
        <DeferredSection
          id="features"
          className="scroll-mt-28"
          rootMargin="600px 0px"
          placeholderClassName="h-[320vh] bg-transparent"
        >
          <Suspense
            fallback={<div className="h-[320vh] bg-transparent" aria-hidden="true" />}
          >
            <LandingFeaturesSection sectionId={null} />
          </Suspense>
        </DeferredSection>
        <DeferredSection
          id="hall-of-fame"
          className="scroll-mt-28"
          rootMargin="500px 0px"
          placeholderClassName="min-h-[70vh] bg-transparent"
        >
          <Suspense
            fallback={<div className="min-h-[70vh] bg-transparent" aria-hidden="true" />}
          >
            <LandingHallOfFame sectionId={null} />
          </Suspense>
        </DeferredSection>
        <Suspense
          fallback={<div style={{ height: 'calc(100vh + 680px)' }} className="bg-transparent" aria-hidden="true" />}
        >
          <StickyFooter />
        </Suspense>
      </main>
    </div>
  );
}
