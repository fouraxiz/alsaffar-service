'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';

const ROTATE_INTERVAL_MS = 5000;

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=85&auto=format&fit=crop',
    alt: 'Professional business meeting',
  },
  {
    src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=700&q=85&auto=format&fit=crop',
    alt: 'Professional consultant welcoming a client',
  },
  {
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700&q=85&auto=format&fit=crop',
    alt: 'Domestic worker cleaning a home',
  },
  {
    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=85&auto=format&fit=crop',
    alt: 'Experienced recruitment professional',
  },
];

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', onStoreChange);

  return () => mediaQuery.removeEventListener('change', onStoreChange);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function HeroImageRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  const showNextImage = () => {
    setIndex((i) => (i + 1) % HERO_IMAGES.length);
  };

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % HERO_IMAGES.length),
      ROTATE_INTERVAL_MS
    );
    return () => clearInterval(id);
  }, [paused, reducedMotion]);

  return (
    <button
      type="button"
      aria-label="Show next hero image"
      className="relative block w-full max-w-md aspect-[7/8] rounded-3xl overflow-hidden shadow-2xl shadow-orange-100 z-10 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/40"
      onClick={showNextImage}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_IMAGES.map((img, i) => {
        const active = i === index;
        return (
          <div
            key={img.src}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 1024px) 28rem, 100vw"
              priority={i === 0}
              className={`object-cover ${active && !reducedMotion ? 'animate-kenburns' : ''}`}
              style={{
                // alternate zoom direction so consecutive slides don't feel identical
                transformOrigin: i % 2 === 0 ? '30% 40%' : '70% 60%',
                animationPlayState: paused ? 'paused' : 'running',
              }}
            />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent" />
    </button>
  );
}
