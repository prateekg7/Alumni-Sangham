import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function PlaceholdersAndVanishInput({ placeholders, value: controlledValue, onChange, onSubmit, className }) {
  const [currentPlaceholder, setCurrentPlaceholder] = React.useState(0);
  const [value, setValue] = React.useState(controlledValue ?? '');
  const [animating, setAnimating] = React.useState(false);
  const canvasRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const particlesRef = React.useRef([]);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setCurrentPlaceholder((current) => (current + 1) % placeholders.length);
    }, 3000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setCurrentPlaceholder((current) => (current + 1) % placeholders.length);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [placeholders.length]);

  const draw = React.useCallback(() => {
    const input = inputRef.current;
    const canvas = canvasRef.current;
    if (!input || !canvas || !value) {
      particlesRef.current = [];
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    canvas.width = 800;
    canvas.height = 200;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const computedStyles = getComputedStyle(input);
    const fontSize = parseFloat(computedStyles.getPropertyValue('font-size')) || 16;
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily || 'Inter'}`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(value, 24, 70);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const particles = [];
    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const index = (y * canvas.width + x) * 4;
        if (imageData.data[index + 3] > 0) {
          particles.push({ x, y, r: 1, opacity: imageData.data[index + 3] / 255 });
        }
      }
    }
    particlesRef.current = particles;
  }, [value]);

  const animateParticles = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      setValue('');
      setAnimating(false);
      return;
    }

    let frame = 0;
    const tick = () => {
      frame += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current
        .map((particle) => ({
          ...particle,
          x: particle.x + 2 + Math.random() * 4,
          y: particle.y + (Math.random() - 0.5) * 5,
          r: Math.max(0, particle.r - 0.025),
          opacity: Math.max(0, particle.opacity - 0.025),
        }))
        .filter((particle) => particle.opacity > 0.02 && particle.r > 0.02);

      particlesRef.current.forEach((particle) => {
        ctx.fillStyle = `rgba(255,255,255,${particle.opacity})`;
        ctx.fillRect(particle.x, particle.y, particle.r, particle.r);
      });

      if (particlesRef.current.length && frame < 90) {
        window.requestAnimationFrame(tick);
      } else {
        setValue('');
        setAnimating(false);
      }
    };

    tick();
  }, []);

  React.useEffect(() => {
    draw();
  }, [draw]);

  const vanishAndSubmit = React.useCallback(() => {
    if (!value.trim() || animating) {
      return;
    }
    setAnimating(true);
    draw();
    animateParticles();
  }, [animateParticles, animating, draw, value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    vanishAndSubmit();
    onSubmit?.(event);
  };

  return (
    <form
      className={cn(
        'directory-vanish-search relative mx-auto h-14 w-full overflow-hidden rounded-full border border-white/10 bg-[#141414] transition focus-within:border-white/30',
        className,
      )}
      onSubmit={handleSubmit}
    >
      <canvas
        ref={canvasRef}
        className={cn(
          'pointer-events-none absolute left-4 top-1/2 z-20 h-24 w-[800px] -translate-y-1/2 scale-50 origin-left',
          animating ? 'opacity-100' : 'opacity-0',
        )}
      />
      <input
        ref={inputRef}
        value={value}
        type="text"
        onChange={(event) => {
          if (animating) {
            return;
          }
          setValue(event.target.value);
          onChange?.(event);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            vanishAndSubmit();
          }
        }}
        className={cn(
          'relative z-10 h-full w-full border-none bg-transparent pl-6 pr-16 text-sm text-white outline-none ring-0 placeholder:text-white/35 focus:outline-none focus:ring-0 sm:pl-8',
          animating && 'text-transparent',
        )}
      />
      <button
        type="submit"
        disabled={!value}
        className="absolute right-2 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f5eee8] text-black transition disabled:bg-white/10 disabled:text-white/28"
        aria-label="Submit search"
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 12h14"
            initial={{ strokeDasharray: '50%', strokeDashoffset: '50%' }}
            animate={{ strokeDashoffset: value ? 0 : '50%' }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
          <path d="m13 18 6-6" />
          <path d="m13 6 6 6" />
        </motion.svg>
      </button>
      <div className="pointer-events-none absolute inset-0 flex items-center rounded-full">
        <AnimatePresence mode="wait">
          {!value ? (
            <motion.p
              key={currentPlaceholder}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'linear' }}
              className="w-[calc(100%-4rem)] truncate pl-6 text-left text-sm text-white/38 sm:pl-8"
            >
              {placeholders[currentPlaceholder]}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
