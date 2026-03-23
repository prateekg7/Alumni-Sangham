import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FRAME_COUNT = 240;

// Object-fit cover draw helper – declared at module level so it's always available
function drawCover(ctx, img, canvas) {
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const cx = (canvas.width - img.width * ratio) / 2;
  const cy = (canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
}

export function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // --- Framer Motion scroll for overlay animations only ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const scale  = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const yText  = useTransform(scrollYProgress, [0, 0.5], [0, -200]);

  // --- Preload all frames ---
  useEffect(() => {
    let loadedCount = 0;
    const images = Array.from({ length: FRAME_COUNT }, (_, i) => {
      const img = new Image();
      const num = String(i + 1).padStart(4, '0');
      img.src = `/frames/frame_${num}.jpg`;
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        // Draw the very first frame as soon as it loads
        if (i === 0 && canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width  = window.innerWidth;
          canvas.height = window.innerHeight;
          drawCover(canvas.getContext('2d'), img, canvas);
        }
      };
      return img;
    });
    imagesRef.current = images;
  }, []);

  // --- Raw window scroll → canvas update (most reliable approach) ---
  useEffect(() => {
    const renderFrame = (frameIndex) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const imgs = imagesRef.current;

      // Find the nearest already-loaded frame to avoid black frames
      let idx = frameIndex;
      if (!imgs[idx]?.complete || imgs[idx]?.naturalHeight === 0) {
        // Walk backwards to find closest loaded frame
        for (let k = idx - 1; k >= 0; k--) {
          if (imgs[k]?.complete && imgs[k]?.naturalHeight !== 0) { idx = k; break; }
        }
      }
      const img = imgs[idx];
      if (!img?.complete || img.naturalHeight === 0) return;

      // Only reset canvas dimensions when they actually changed (prevents invisible clear)
      if (canvas.width !== window.innerWidth)  canvas.width  = window.innerWidth;
      if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;

      drawCover(canvas.getContext('2d'), img, canvas);
      lastFrameRef.current = idx;
    };

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const { top, height } = container.getBoundingClientRect();
        // progress: 0 when top of container at top of viewport, 1 when bottom at bottom
        const progress = Math.max(0, Math.min(1, -top / (height - window.innerHeight)));
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        renderFrame(frameIndex);
      });
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(lastFrameRef.current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-[400vh]">
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-[0.7] pointer-events-none"
          style={{ opacity }}
        />

        {/* Overlay text */}
        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
          style={{ y: yText, scale, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
            className="pointer-events-none"
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter drop-shadow-2xl pointer-events-auto">
              Unite. Innovate. <br />
              <span className="text-blue-400">Elevate.</span>
            </h1>
            <p className="mt-6 font-medium text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto tracking-wide mix-blend-screen drop-shadow-md pointer-events-auto">
              Welcome back to your roots. Connect with the IITP global family and build futures that echo eternity.
            </p>

            <div className="mt-10 flex items-center justify-center pointer-events-auto">
              {imagesLoaded < FRAME_COUNT && (
                <div className="text-white/50 text-sm font-semibold tracking-widest uppercase animate-pulse">
                  Loading: {Math.floor((imagesLoaded / FRAME_COUNT) * 100)}%
                </div>
              )}
            </div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-80"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">Scroll to explore</div>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                <motion.div
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}
