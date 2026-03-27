'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '../../lib/utils'
import { Quote } from 'lucide-react'

// Using Quote instead of Slack/Github/Twitter for random alumni filler nodes
gsap.registerPlugin(ScrollTrigger)

export function StaggeredGrid({ 
  images = [], 
  bentoItems = [], 
  centerText = "Halcyon", 
  credits = { 
    madeBy: { text: "", href: "" }, 
    moreDemos: { text: "", href: "" } 
  }, 
  className, 
  showFooter = false
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const gridFullRef = useRef(null)
  const textRef = useRef(null)
  const [activeBento, setActiveBento] = useState(0);

  const splitText = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  useEffect(() => {
    const handleLoad = () => {
      document.body.classList.remove('loading')
      setIsLoaded(true)
    }
    
    const imgElements = document.querySelectorAll('img');
    if (imgElements.length > 0) {
      let loadedCount = 0;
      const onImageLoad = () => {
        loadedCount++;
        if (loadedCount >= imgElements.length) handleLoad();
      };
      
      Array.from(imgElements).forEach(img => {
        if (img.complete) {
          onImageLoad();
        } else {
          img.addEventListener('load', onImageLoad, { once: true });
          img.addEventListener('error', onImageLoad, { once: true }); 
        }
      });
      // Safety fallback
      setTimeout(handleLoad, 1000);
    } else {
      handleLoad();
    }
    
    return () => { }
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    if (textRef.current) {
      const chars = textRef.current.querySelectorAll('.char')
      gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top bottom',
          end: 'bottom center',
          scrub: 1.5,
        }
      }).from(chars, {
        ease: 'sine.out',
        yPercent: 300,
        autoAlpha: 0,
        stagger: {
          each: 0.05,
          from: 'center'
        }
      })
    }

    if (gridFullRef.current) {
      const gridFullItems = gridFullRef.current.querySelectorAll('.grid__item')
      const numColumns = getComputedStyle(gridFullRef.current)
        .getPropertyValue('grid-template-columns').split(' ').length
      const middleColumnIndex = Math.floor(numColumns / 2)
      const columns = Array.from({ length: numColumns }, () => [])

      gridFullItems.forEach((item, index) => {
        columns[index % numColumns].push(item)
      })

      columns.forEach((columnItems, columnIndex) => {
        const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2
        gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            start: 'top bottom',
            end: 'bottom center',
            scrub: 2,
          }
        })
        .from(columnItems, {
          yPercent: 450,
          autoAlpha: 0,
          delay: delayFactor,
          ease: 'sine.out',
        })
        .from(columnItems.map(item => item.querySelector('.grid__item-img')), {
          transformOrigin: '50% 0%',
          ease: 'sine.out',
        }, 0)
      })

      const bentoContainer = gridFullRef.current.querySelector('.bento-container')
      if (bentoContainer) {
        gsap.timeline({
          scrollTrigger: {
            trigger: gridFullRef.current,
            start: 'top center',
            end: 'bottom+=50% center',
            scrub: 1.5,
            invalidateOnRefresh: true,
          }
        }).to(bentoContainer, {
          y: window.innerHeight * 0.35,
          scale: 1.15,
          zIndex: 1000,
          ease: 'power2.out',
          duration: 1,
          force3D: true
        }, 0)
      }
    }
  }, [isLoaded])

  // Pad the grid to have enough items
  const mixedGridItems = [...images, ...images, ...images, images[0] || images[0]?.src || ''].slice(0, 35);
  mixedGridItems[16] = 'BENTO_GROUP';

  return (
    <div 
      className={cn("shadow relative overflow-hidden w-full", className)}
      style={{ '--grid-item-translate': '0px' }}
    >
      <section className="grid place-items-center w-full relative mt-[10vh]">
        <div ref={textRef} className="text font-alt uppercase flex content-center text-[clamp(2.5rem,10vw,8rem)] leading-[0.7] text-white">
          {splitText(centerText)}
        </div>
      </section>
      
      <section className="grid place-items-center w-full relative">
        <div ref={gridFullRef} className="grid--full relative w-full my-[10vh] h-auto aspect-[1.1] max-w-none p-4 grid gap-4 grid-cols-7 grid-rows-5">
          <div className="grid-overlay absolute inset-0 z-[15] pointer-events-none opacity-0 bg-black/80 rounded-lg transition-opacity duration-500" />
          
          {mixedGridItems.map((item, i) => {
            if (item === 'BENTO_GROUP') {
              if (!bentoItems || bentoItems.length === 0) return null;
              
              return (
                <div key="bento-group" className="grid__item bento-container col-span-3 row-span-1 relative z-20 flex items-center justify-center gap-2 h-full w-full will-change-transform">
                  {bentoItems.map((bentoItem, index) => {
                    const isActive = activeBento === index;
                    return (
                      <div
                        key={bentoItem.id}
                        className={cn(
                          "relative cursor-pointer overflow-hidden rounded-2xl h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                          isActive ? "bg-zinc-900/10 shadow-2xl" : "bg-black/50 backdrop-blur-md"
                        )}
                        style={{ width: isActive ? "60%" : "20%" }}
                        onMouseEnter={() => setActiveBento(index)}
                        onClick={() => setActiveBento(index)}
                      >
                        <div className={cn(
                          "absolute inset-0 rounded-2xl border z-50 pointer-events-none transition-colors duration-700",
                          isActive ? "border-amber-500/50" : "border-white/10"
                        )} />
                        
                        <div className="relative z-10 w-full h-full flex flex-col p-0">
                          <div className={cn(
                            "absolute inset-0 flex flex-col transition-all duration-500 ease-in-out",
                            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                          )}>
                            <div className="absolute inset-0 bg-zinc-900 overflow-hidden z-0 group/img">
                              {bentoItem.image && (
                                <>
                                  <img 
                                    src={bentoItem.image} 
                                    alt={bentoItem.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-90"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
                                </>
                              )}
                            </div>
                            <div className="absolute bottom-0 left-0 w-full h-[150px] flex items-start flex-col justify-end pb-5 px-5 z-20">
                              <div className="flex justify-between items-start w-full">
                                <div className="flex flex-col text-left">
                                  <h3 className="text-xl font-bold text-white drop-shadow-md mb-1">{bentoItem.title}</h3>
                                  {bentoItem.subtitle && (
                                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border border-amber-500/30 w-fit">
                                      {bentoItem.subtitle}
                                    </span>
                                  )}
                                </div>
                                <div className="text-amber-400 opacity-60 flex-shrink-0 mt-1">{bentoItem.icon}</div>
                              </div>
                              {bentoItem.description && (
                                <span className="text-white/70 text-xs italic mt-2 line-clamp-2 w-full text-left">{bentoItem.description}</span>
                              )}
                              {bentoItem.onClick && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); bentoItem.onClick(); }}
                                  className="text-amber-500 hover:text-amber-400 text-[10px] font-bold uppercase tracking-widest mt-3 flex items-center gap-1 transition-colors w-fit pointer-events-auto cursor-pointer"
                                >
                                  View full story <span>→</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className={cn(
                          "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-500",
                          isActive ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                        )}>
                          <div className="text-white/30">{bentoItem.icon}</div>
                          <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider text-center px-1 break-words line-clamp-2">{bentoItem.title}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
            
            if (i === 17 || i === 18) return null;
            
            if (typeof item === 'string' || (typeof item === 'object' && item !== null)) {
              const bgUrl = typeof item === 'string' ? item : item.src;
              const handleItemClick = () => {
                if (typeof item === 'object' && item.onClick) {
                  item.onClick();
                }
              };
              
              return (
                <figure 
                  key={`img-${i}`} 
                  onClick={handleItemClick}
                  className="grid__item m-0 relative z-10 [perspective:800px] will-change-[transform,opacity] group cursor-pointer"
                >
                  <div 
                    className="grid__item-img w-full h-full [backface-visibility:hidden] will-change-transform rounded-xl overflow-hidden shadow-sm border border-white/10 dark:bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-xl group-hover:border-amber-500/30"
                    style={{ backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  >
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/10 group-hover:to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-0" />
                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Quote className="w-5 h-5 text-amber-500/80" />
                    </div>
                  </div>
                </figure>
              )
            }
            return null;
          })}
        </div>
      </section>
      
      {showFooter && (
        <footer className="frame__footer w-full p-8 flex justify-between items-center relative z-50 text-white/50 uppercase font-medium text-xs tracking-wider">
          <a href={credits.madeBy.href} className="hover:text-white transition-colors">{credits.madeBy.text}</a>
          <a href={credits.moreDemos.href} className="hover:text-white transition-colors">{credits.moreDemos.text}</a>
        </footer>
      )}
    </div>
  )
}

export default StaggeredGrid
