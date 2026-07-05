'use client';

import { useEffect, useRef } from 'react';

type Props = {
  /** Kept for backwards compatibility but not used in the new pattern approach. */
  shapes?: string[];
  className?: string;
};

export default function SilhouetteBackdrop({
  className = '',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        // -1..1 as the section centre travels across the viewport
        const progress =
          (rect.top + rect.height / 2 - window.innerHeight / 2) /
          window.innerHeight;
        el.style.setProperty('--drift', String(progress * -30));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] ${className}`}
      style={{ '--drift': 0 } as React.CSSProperties}
    >
      {/* 
        Using the newly generated detailed milk-shadow pattern 
        which includes the elderly caregiver, nanny, skilled workers, etc.
      */}
      <div
        className="absolute inset-[-50%] w-[200%] h-[200%] opacity-90 mix-blend-multiply"
        style={{
          backgroundImage: 'url(/images/manpower_silhouettes_bg.png)',
          backgroundSize: '800px',
          backgroundRepeat: 'repeat',
          transform: `translateY(calc(var(--drift) * 1px)) rotate(-5deg)`,
          transition: 'transform 0.15s linear',
        }}
      />
    </div>
  );
}
