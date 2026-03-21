import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FRAME_COUNT = 240;

export function Hero() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imagesRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameNumber = String(i).padStart(4, '0');
      img.src = `/frames/frame_${frameNumber}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        
        // Draw first frame when ready
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          drawCover(ctx, img, canvasRef.current);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Update canvas on scroll
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(latest * FRAME_COUNT)
      );
      
      requestAnimationFrame(() => {
        if (!canvasRef.current || !imagesRef.current[frameIndex]) return;
        const ctx = canvasRef.current.getContext('2d');
        const img = imagesRef.current[frameIndex];
        
        // Ensure standard dimensions
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        
        if (img.complete && img.naturalHeight !== 0) {
           drawCover(ctx, img, canvasRef.current);
        }
      });
    });
  }, [scrollYProgress]);

  // Handle window resize mapping
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && imagesRef.current.length > 0) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const latest = scrollYProgress.get();
        const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(latest * FRAME_COUNT));
        const ctx = canvasRef.current.getContext('2d');
        const img = imagesRef.current[frameIndex] || imagesRef.current[0];
        if (img && img.complete) drawCover(ctx, img, canvasRef.current);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scrollYProgress]);

  // Object-fit cover logic for Canvas
  const drawCover = (ctx, img, canvas) => {
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio  = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  };

  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  const yText = useTransform(scrollYProgress, [0, 0.5], [0, -200]);

  return (
    // The container height controls the scrolling duration.
    // 400vh gives a nicely paced 4-screen-height scroll duration for the 240 frames.
    <div ref={containerRef} className="relative h-[400vh] bg-black">
      
      {/* Sticky Canvas Wrap */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        <motion.canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-[0.7]" 
          style={{ opacity }}
        />
        
        {/* Overlay Content */}
        <motion.div 
          className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4"
          style={{ y: yText, scale, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter drop-shadow-2xl">
              Unite. Innovate. <br />
              <span className="text-blue-400">Elevate.</span>
            </h1>
            <p className="mt-6 font-medium text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto tracking-wide mix-blend-screen drop-shadow-md">
              Welcome back to your roots. Connect with the IITP global family and build futures that echo eternity.
            </p>
            <div className="mt-10 flex items-center justify-center space-x-6">
              {imagesLoaded < FRAME_COUNT && (
                 <div className="text-white/50 text-sm font-semibold tracking-widest uppercase animate-pulse">
                   Incoming Signal: {Math.floor((imagesLoaded / FRAME_COUNT) * 100)}%
                 </div>
              )}
            </div>
            
            {/* Scroll Indicator */}
            <motion.div 
              className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-80"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-white/60 text-xs font-bold tracking-widest uppercase mb-3">Scroll to explore</div>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                <motion.div 
                  className="w-1.5 h-1.5 bg-white rounded-full"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Glassmorphic fade overlay at the bottom for transition to next section */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}
