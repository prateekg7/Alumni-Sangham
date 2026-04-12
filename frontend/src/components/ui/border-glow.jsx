import React, { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export default function BorderGlow({ children, className }) {
  const cardRef = useRef(null);

  const handlePointerMove = useCallback((event) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--blog-glow-x', `${x}%`);
    card.style.setProperty('--blog-glow-y', `${y}%`);
  }, []);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty('--blog-glow-x', '50%');
    card.style.setProperty('--blog-glow-y', '50%');
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn('blog-border-glow-card', className)}
    >
      <div className="blog-border-glow-inner">{children}</div>
    </div>
  );
}
