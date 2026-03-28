import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Sidebar({ mobileOpen, expanded = false, children, className, ...props }) {
  return (
    <aside
      {...props}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r border-[#2A2940] bg-[#1A1925] transition-[width,transform] duration-300 ease-out md:translate-x-0',
        mobileOpen && 'translate-x-0',
        expanded ? 'md:w-64' : 'md:w-20',
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarBody({ className, children }) {
  return <div className={cn('flex h-full flex-col justify-between gap-6 px-3 py-4', className)}>{children}</div>;
}

export function SidebarLink({ link, active = false, compact = false, className, onClick }) {
  const content = (
    <>
      <span
        className={cn(
          'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors',
          active
            ? 'bg-[#6C63FF]/10 text-[#6C63FF]'
            : 'text-[#9694A8] group-hover:text-[#E8E6F0]',
        )}
      >
        {link.icon}
      </span>
      <motion.span
        animate={{
          opacity: compact ? 0 : 1,
          width: compact ? 0 : 'auto',
          marginLeft: compact ? 0 : 12,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={cn(
          'relative z-10 overflow-hidden whitespace-pre text-sm',
          active ? 'font-medium text-[#6C63FF]' : 'text-[#9694A8] group-hover:text-[#E8E6F0]',
        )}
      >
        {link.label}
      </motion.span>
    </>
  );

  const classes = cn(
    'group relative flex items-center overflow-hidden rounded-md px-3 py-2.5 transition-colors',
    active
      ? 'border-l-2 border-[#6C63FF] bg-[#6C63FF]/10'
      : 'border-l-2 border-transparent hover:bg-[#242336]',
    className,
  );

  const indicator = active ? (
    <span className="absolute inset-y-0 left-0 w-0.5 bg-[#6C63FF]" />
  ) : null;

  if (link.href) {
    const to = link.hash ? { pathname: link.href, hash: link.hash } : link.href;
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {indicator}
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={cn(classes, 'w-full text-left')} onClick={onClick}>
      {indicator}
      {content}
    </button>
  );
}
