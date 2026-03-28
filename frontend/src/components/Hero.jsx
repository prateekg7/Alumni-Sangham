import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FRAME_COUNT = 240;
const INITIAL_FRAME_COUNT = 8;
const NEARBY_FRAME_WINDOW = 6;
const BACKGROUND_PRELOAD_BATCH = 12;
const PROGRESS_UPDATE_INTERVAL = 12;

const getFrameSrc = (index) => `/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`;

const isFrameReady = (img) => Boolean(img?.complete && img.naturalHeight !== 0);

const scheduleIdle = (callback) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, { timeout: 400 });
  }

  return window.setTimeout(
    () =>
      callback({
        didTimeout: false,
        timeRemaining: () => 0,
      }),
    200,
  );
};

const cancelIdle = (id) => {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
    return;
  }

  window.clearTimeout(id);
};

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
  const imagesRef = useRef(Array(FRAME_COUNT).fill(null));
  const loadingRef = useRef(new Map());
  const renderFrameRef = useRef(() => {});
  const loadFrameRef = useRef(() => Promise.resolve(null));
  const loadedCountRef = useRef(0);
  const reportedProgressRef = useRef(0);
  const idlePreloadRef = useRef(null);
  const rafRef = useRef(null);
  const lastFrameRef = useRef(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const yText = useTransform(scrollYProgress, [0, 0.5], [0, -200]);

  useEffect(() => {
    let isActive = true;
    let nextFrameToPreload = INITIAL_FRAME_COUNT;

    const commitProgress = (nextValue, force = false) => {
      if (
        force ||
        nextValue === FRAME_COUNT ||
        nextValue - reportedProgressRef.current >= PROGRESS_UPDATE_INTERVAL
      ) {
        reportedProgressRef.current = nextValue;
        setImagesLoaded(nextValue);
      }
    };

    const loadFrame = (frameIndex, { renderOnLoad = false, priority = 'low' } = {}) => {
      if (frameIndex < 0 || frameIndex >= FRAME_COUNT) {
        return Promise.resolve(null);
      }

      const cachedImage = imagesRef.current[frameIndex];
      if (isFrameReady(cachedImage)) {
        if (renderOnLoad) {
          renderFrameRef.current(frameIndex);
        }
        return Promise.resolve(cachedImage);
      }

      if (loadingRef.current.has(frameIndex)) {
        const pending = loadingRef.current.get(frameIndex);
        if (renderOnLoad) {
          pending.then(() => renderFrameRef.current(frameIndex));
        }
        return pending;
      }

      const img = cachedImage ?? new Image();
      img.decoding = 'async';
      if ('fetchPriority' in img) {
        img.fetchPriority = priority;
      }

      const promise = new Promise((resolve) => {
        img.onload = () => {
          loadingRef.current.delete(frameIndex);

          if (!isActive) {
            resolve(img);
            return;
          }

          loadedCountRef.current += 1;
          commitProgress(loadedCountRef.current, frameIndex === 0);

          if (renderOnLoad) {
            renderFrameRef.current(frameIndex);
          }

          resolve(img);
        };

        img.onerror = () => {
          loadingRef.current.delete(frameIndex);
          resolve(null);
        };
      });

      imagesRef.current[frameIndex] = img;
      loadingRef.current.set(frameIndex, promise);
      img.src = getFrameSrc(frameIndex);
      return promise;
    };

    const preloadRemainingFrames = () => {
      if (!isActive || nextFrameToPreload >= FRAME_COUNT) {
        return;
      }

      const batchEnd = Math.min(FRAME_COUNT, nextFrameToPreload + BACKGROUND_PRELOAD_BATCH);
      for (let i = nextFrameToPreload; i < batchEnd; i += 1) {
        loadFrame(i);
      }
      nextFrameToPreload = batchEnd;

      if (nextFrameToPreload < FRAME_COUNT) {
        idlePreloadRef.current = scheduleIdle(preloadRemainingFrames);
      }
    };

    loadFrameRef.current = loadFrame;
    loadFrame(0, { renderOnLoad: true, priority: 'high' });
    for (let i = 1; i < INITIAL_FRAME_COUNT; i += 1) {
      loadFrame(i);
    }
    idlePreloadRef.current = scheduleIdle(preloadRemainingFrames);

    return () => {
      isActive = false;
      if (idlePreloadRef.current !== null) {
        cancelIdle(idlePreloadRef.current);
      }
      loadingRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const renderFrame = (frameIndex) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const imgs = imagesRef.current;
      const safeFrameIndex = Math.max(0, Math.min(FRAME_COUNT - 1, frameIndex));

      for (
        let i = Math.max(0, safeFrameIndex - 1);
        i <= Math.min(FRAME_COUNT - 1, safeFrameIndex + NEARBY_FRAME_WINDOW);
        i += 1
      ) {
        loadFrameRef.current(i);
      }

      let idx = safeFrameIndex;
      if (!isFrameReady(imgs[idx])) {
        for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
          const previous = safeFrameIndex - offset;
          if (previous >= 0 && isFrameReady(imgs[previous])) {
            idx = previous;
            break;
          }

          const next = safeFrameIndex + offset;
          if (next < FRAME_COUNT && isFrameReady(imgs[next])) {
            idx = next;
            break;
          }
        }
      }

      const img = imgs[idx];
      if (!isFrameReady(img)) return;

      if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
      if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;

      drawCover(canvas.getContext('2d'), img, canvas);
      lastFrameRef.current = idx;
    };

    renderFrameRef.current = renderFrame;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const { top, height } = container.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -top / (height - window.innerHeight)));
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(progress * FRAME_COUNT));
        renderFrame(frameIndex);
      });
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(lastFrameRef.current);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} id="home" className="relative h-[400vh] scroll-mt-28">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-[0.7] pointer-events-none"
          style={{ opacity }}
        />

        <motion.div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center pointer-events-none"
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
            <p className="mt-6 mx-auto max-w-2xl text-xl md:text-2xl font-medium tracking-wide text-blue-100 mix-blend-screen drop-shadow-md pointer-events-auto">
              Welcome back to your roots. Connect with the IITP global family and build futures that echo eternity.
            </p>

            <div className="mt-10 flex items-center justify-center pointer-events-auto">
              {imagesLoaded < FRAME_COUNT && (
                <div className="animate-pulse text-sm font-semibold tracking-widest uppercase text-white/50">
                  Loading: {Math.floor((imagesLoaded / FRAME_COUNT) * 100)}%
                </div>
              )}
            </div>

            <motion.div
              className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center opacity-80"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="mb-3 text-xs font-bold tracking-widest uppercase text-white/60">Scroll to explore</div>
              <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30 p-1">
                <motion.div
                  className="h-1.5 w-1.5 rounded-full bg-white"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-0 left-0 z-20 h-32 w-full bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
