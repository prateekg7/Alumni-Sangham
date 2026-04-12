import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatefulButton({
  className,
  children,
  loadingLabel = 'Publishing...',
  successLabel = 'Published',
  onClick,
  disabled,
  ...props
}) {
  const [state, setState] = useState('idle');
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = async (event) => {
    if (disabled || state === 'loading') return;

    setState('loading');

    try {
      await onClick?.(event);
      setState('success');
      timeoutRef.current = window.setTimeout(() => setState('idle'), 1200);
    } catch {
      setState('idle');
    }
  };

  const label =
    state === 'loading' ? loadingLabel : state === 'success' ? successLabel : children;

  return (
    <motion.button
      type="button"
      layout
      onClick={handleClick}
      disabled={disabled || state === 'loading'}
      className={cn(
        'inline-flex min-w-[148px] items-center justify-center gap-2 rounded-[8px] bg-[#f5eee8] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          className="inline-flex items-center gap-2"
        >
          {state === 'loading' ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {state === 'success' ? <CheckCircle2 className="h-4 w-4" /> : null}
          <span>{label}</span>
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
