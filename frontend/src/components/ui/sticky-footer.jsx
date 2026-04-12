import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FacebookIcon,
  GraduationCap,
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import './sticky-footer.css';

const FOOTER_HEIGHT = 680;

const socialLinks = [
  { title: 'Facebook', href: '#', icon: FacebookIcon },
  { title: 'Instagram', href: '#', icon: InstagramIcon },
  { title: 'YouTube', href: '#', icon: YoutubeIcon },
  { title: 'LinkedIn', href: '#', icon: LinkedinIcon },
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
        <div className="pointer-events-auto relative flex h-[680px] flex-col justify-between overflow-hidden rounded-t-[34px] border-t border-white/10 bg-[#0c323d] shadow-[0_-24px_90px_rgba(0,0,0,0.34)]">
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

          <div className="relative z-10 flex h-full flex-col justify-between px-6 py-10 text-white md:px-12 md:py-12 lg:px-16">
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
                    <Button
                      key={link.title}
                      asChild
                      size="icon"
                      variant="outline"
                      className="h-9 w-9 rounded-full border-white/15 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                    >
                      <a href={link.href} aria-label={link.title}>
                        <link.icon className="h-4 w-4" />
                      </a>
                    </Button>
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
              <p>Sticky close, gooey on the edge, and meant to leave the page with momentum.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
