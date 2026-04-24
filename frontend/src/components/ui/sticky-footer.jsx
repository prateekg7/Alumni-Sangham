import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import footerPoster from '@/assets/footerposter.svg';
import './sticky-footer.css';

const FOOTER_HEIGHT = 950;

const socialLinks = [
  {
    title: 'LinkedIn',
    href: '#',
    color: '#0077b5',
    path: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z',
  },
  {
    title: 'Instagram',
    href: '#',
    color: '#c13584',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    title: 'YouTube',
    href: '#',
    color: '#ff0000',
    path: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z',
  },
  {
    title: 'Facebook',
    href: '#',
    color: '#1877f2',
    path: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z',
  },
  {
    title: 'Twitter',
    href: '#',
    color: '#1da1f2',
    path: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
  },
  {
    title: 'GitHub',
    href: '#',
    color: '#ffffff',
    path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
];

const footerLinkGroups = [
  {
    label: 'Platform',
    links: [
      { title: 'About', href: '/#about' },
      { title: 'Features', href: '/#features' },
      { title: 'Hall of fame', href: '/#hall-of-fame' },
      { title: 'Join the network', href: '/register/student' },
    ],
  },
  {
    label: 'Explore',
    links: [
      { title: 'Directory', href: '/directory' },
      { title: 'Blogs & jobs', href: '/blog' },
      { title: 'Referral requests', href: '/referrals' },
      { title: 'Profiles', href: '/profile/me' },
    ],
  },
  {
    label: 'Community',
    links: [
      { title: 'Mentorship circles', href: '#' },
      { title: 'Career support', href: '#' },
      { title: 'Campus stories', href: '#' },
      { title: 'Alumni chapters', href: '#' },
    ],
  },
];

const bubbleSpecs = Array.from({ length: 26 }, (_, index) => ({
  size: `${2.2 + (index % 5) * 0.7}rem`,
  distance: `${7 + (index % 6)}rem`,
  position: `${4 + ((index * 13) % 92)}%`,
  time: `${2.8 + (index % 4) * 0.35}s`,
  delay: `${-1 * (1.6 + (index % 5) * 0.35)}s`,
}));

function AnimatedContainer({ delay = 0.1, className, children }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.75, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StickyFooter({ className, ...props }) {
  return (
    <footer
      className={cn('landing-sticky-footer relative w-full', className)}
      style={{
        height: `calc(100vh + ${FOOTER_HEIGHT}px)`,
        '--footer-background': '#0c323d',
      }}
      {...props}
    >
      <div
        className="landing-footer-reveal sticky"
        style={{ top: `calc(100vh - ${FOOTER_HEIGHT}px)` }}
      >
        <div className="pointer-events-auto relative flex flex-col overflow-hidden rounded-t-[34px] border-t border-white/10 bg-[#0c323d] shadow-[0_-24px_90px_rgba(0,0,0,0.34)]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent 36%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.06), transparent 28%), linear-gradient(180deg, rgba(8,64,82,0.82), rgba(6,28,36,1))',
            }}
          />

          <div className="landing-footer-bubbles absolute inset-x-0 top-0 h-10" aria-hidden="true">
            {bubbleSpecs.map((bubble, index) => (
              <span
                key={index}
                className="landing-footer-bubble"
                style={{
                  '--size': bubble.size,
                  '--distance': bubble.distance,
                  '--position': bubble.position,
                  '--time': bubble.time,
                  '--delay': bubble.delay,
                }}
              />
            ))}
          </div>

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-full h-0 w-0"
          >
            <defs>
              <filter id="landing-footer-blob">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                  result="blob"
                />
              </filter>
            </defs>
          </svg>

          <div className="relative z-10 flex flex-col justify-between px-6 py-10 text-white md:px-12 md:py-12 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/12 via-white/4 to-transparent"
            />
            <div className="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))]">
              <AnimatedContainer className="max-w-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/10">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h2
                  className="mt-6 text-4xl font-semibold leading-tight text-white"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  Alumni Sangham
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  A tighter platform for alumni discovery, thoughtful referral requests, and the kind
                  of career support that still feels human.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {socialLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      aria-label={link.title}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/8 transition-colors hover:bg-white/14"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        style={{ color: link.color }}
                        viewBox="0 0 24 24"
                      >
                        <path d={link.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </AnimatedContainer>

              {footerLinkGroups.map((group, index) => (
                <AnimatedContainer
                  key={group.label}
                  delay={0.16 + index * 0.08}
                  className="w-full"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/46">
                    {group.label}
                  </div>
                  <ul className="mt-5 space-y-3 text-sm text-white/76">
                    {group.links.map((link) => (
                      <li key={link.title}>
                        <a
                          href={link.href}
                          className="inline-flex items-center transition-colors duration-300 hover:text-white"
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </AnimatedContainer>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/62 md:flex-row md:items-center md:justify-between">
              <p>© 2026 Alumni Sangham. Built for IIT Patna’s alumni and students.</p>
            </div>
          </div>

          {/* Footer Poster */}
          <div className="relative z-10 w-full">
            <img
              src={footerPoster}
              alt="Alumni Sangham – IIT Patna"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
