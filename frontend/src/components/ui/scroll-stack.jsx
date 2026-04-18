import { useCallback, useLayoutEffect, useRef } from 'react';
import './scroll-stack.css';

export function ScrollStackItem({ children, itemClassName = '' }) {
  return (
    <div className="scroll-stack-card-wrapper">
      <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
    </div>
  );
}

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}) {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const wrappersRef = useRef([]);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(0);
  const lastTransformsRef = useRef(new Map());
  // Cache element offsets to avoid layout thrashing on every scroll frame
  const cachedOffsetsRef = useRef([]);
  const cachedEndOffsetRef = useRef(0);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
      };
    }
    const scroller = scrollerRef.current;
    return {
      scrollTop: scroller?.scrollTop || 0,
      containerHeight: scroller?.clientHeight || 0,
    };
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element) => {
      if (!element) return 0;
      if (!useWindowScroll) return element.offsetTop;
      let top = 0;
      let node = element;
      while (node) {
        top += node.offsetTop || 0;
        node = node.offsetParent;
      }
      return top;
    },
    [useWindowScroll],
  );

  // Recalculate and cache all element offsets (call on mount + resize only)
  const cacheOffsets = useCallback(() => {
    cachedOffsetsRef.current = wrappersRef.current.map((w) => getElementOffset(w));
    const endEl = scrollerRef.current?.querySelector('.scroll-stack-end');
    cachedEndOffsetRef.current = getElementOffset(endEl);
  }, [getElementOffset]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
    const endElementTop = cachedEndOffsetRef.current;

    cardsRef.current.forEach((card, index) => {
      const wrapper = wrappersRef.current[index];
      if (!card || !wrapper) return;

      const cardTop = cachedOffsetsRef.current[index] ?? 0;
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = triggerStart;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + index * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let i = 0; i < cachedOffsetsRef.current.length; i += 1) {
          const comparedTop = cachedOffsetsRef.current[i];
          const comparedTriggerStart = comparedTop - stackPositionPx - itemStackDistance * i;
          if (scrollTop >= comparedTriggerStart) {
            topCardIndex = i;
          }
        }
        if (index < topCardIndex) {
          blur = Math.max(0, (topCardIndex - index) * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index;
      }

      // Round translateY to whole pixels to prevent sub-pixel jitter
      const roundedY = Math.round(translateY);
      const roundedScale = Math.round(scale * 10000) / 10000;
      const roundedRotation = Math.round(rotation * 100) / 100;
      const roundedBlur = Math.round(blur * 10) / 10;

      const prev = lastTransformsRef.current.get(index);
      const changed =
        !prev ||
        prev.translateY !== roundedY ||
        Math.abs(prev.scale - roundedScale) > 0.0001 ||
        Math.abs(prev.rotation - roundedRotation) > 0.05 ||
        Math.abs(prev.blur - roundedBlur) > 0.05;

      if (changed) {
        card.style.transform = `translate3d(0, ${roundedY}px, 0) scale(${roundedScale}) rotate(${roundedRotation}deg)`;
        card.style.filter = roundedBlur > 0 ? `blur(${roundedBlur}px)` : '';
        card.style.zIndex = String(100 + index);
        lastTransformsRef.current.set(index, {
          translateY: roundedY,
          scale: roundedScale,
          rotation: roundedRotation,
          blur: roundedBlur,
        });
      }

      if (index === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
  ]);

  const handleScroll = useCallback(() => {
    if (animationFrameRef.current) return;
    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = 0;
      updateCardTransforms();
    });
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const wrappers = Array.from(scroller.querySelectorAll('.scroll-stack-card-wrapper'));
    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));

    wrappersRef.current = wrappers;
    cardsRef.current = cards;

    cards.forEach((card, index) => {
      if (index < cards.length - 1 && wrappers[index]) {
        wrappers[index].style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
    });

    // Cache offsets once on mount
    cacheOffsets();

    const scrollTarget = useWindowScroll ? window : scroller;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Re-cache offsets on resize instead of reading them every frame
    const handleResize = () => {
      cacheOffsets();
      handleScroll();
    };
    window.addEventListener('resize', handleResize);

    handleScroll();

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      wrappersRef.current = [];
      lastTransformsRef.current.clear();
      cachedOffsetsRef.current = [];
    };
  }, [handleScroll, cacheOffsets, itemDistance, useWindowScroll]);

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
}
