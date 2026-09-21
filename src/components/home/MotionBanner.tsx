'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type ApiBanner = {
  title: { en: string | null; ar: string | null };
  image: string | null;
  link_url: string | null;
  link?: {
    type: string;
    nationality: string | null;
    href: string | null;
  } | null;
  placement: string | null;
};

type MotionBannerProps = {
  initialBanners?: ApiBanner[];
};

type VisualItem = {
  src: string;
  alt: string;
  text: string;
  icon: string;
  href: string | null;
};

function resolveHref(banner: ApiBanner, locale: string): string | null {
  const raw = banner.link?.href || banner.link_url;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  if (path.startsWith('/en/') || path.startsWith('/ar/')) return path;
  return `/${locale}${path}`;
}

function selectStripBanners(all: ApiBanner[]): ApiBanner[] {
  const stripOnly = all.filter((b) => b.placement === 'strip');
  return stripOnly.length > 0 ? stripOnly : all.filter((b) => b.placement !== 'home_hero');
}

function VisualBannerCard({ item, isAr, index }: { item: VisualItem; isAr: boolean; index: number }) {
  const inner = (
    <div
      className="banner-card group flex items-center gap-3 rounded-2xl px-2 py-1.5"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(232,135,10,0.08) 100%)',
        border: '1px solid rgba(232,135,10,0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="relative shrink-0">
        <div
          className="absolute -inset-1 rounded-full opacity-100"
          style={{
            background: 'conic-gradient(from 0deg, #E8870A, #1A1F00, #E8870A)',
            animation: 'pulseRing 2.5s infinite',
            animationDelay: `${(index % 3) * 0.8}s`,
          }}
        />
        <div
          className="banner-avatar relative rounded-full overflow-hidden border-2 border-brand-orange/60"
          style={{
            boxShadow: '0 0 12px rgba(232,135,10,0.3)',
          }}
        >
          <img src={item.src} alt={item.alt} className="object-cover object-center scale-110 w-full h-full" />
        </div>
      </div>
      <div className="flex flex-col pe-4">
        <span className="banner-label text-brand-orange/80 font-medium tracking-widest uppercase">
          {item.icon} {isAr ? 'الصّفّار' : 'ALSAFFAR'}
        </span>
        <span
          dir={isAr ? 'rtl' : 'ltr'}
          className="banner-text-main font-bold tracking-wide text-white group-hover:text-brand-orange transition-colors"
        >
          {item.text}
        </span>
      </div>
      <div className="text-brand-orange/40 group-hover:text-brand-orange/80 transition-colors text-lg">›</div>
    </div>
  );

  if (item.href) {
    const isExternal = item.href.startsWith('http');
    return (
      <Link
        href={item.href}
        className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-2xl"
        aria-label={item.text}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex-shrink-0 cursor-default">{inner}</div>;
}

export default function MotionBanner({ initialBanners }: MotionBannerProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [apiBanners, setApiBanners] = useState<ApiBanner[]>(() => selectStripBanners(initialBanners ?? []));

  useEffect(() => {
    let active = true;

    fetch('/api/banners?placement=strip')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.banners)) return;
        const next = selectStripBanners(data.banners as ApiBanner[]);
        if (next.some((b) => !!b.image)) {
          setApiBanners(next);
        }
      })
      .catch(() => {
        /* keep dummy marquee when the refresh fails */
      });

    return () => {
      active = false;
    };
  }, []);

  const dummyItems = useMemo<VisualItem[]>(
    () => [
      {
        src: '/images/3d/worker_office.png',
        alt: 'Professional Staffing',
        text: isAr ? 'كوادر مهنية' : 'Professional Staffing',
        icon: '🏢',
        href: null,
      },
      {
        src: '/images/3d/handshake.png',
        alt: 'Trusted Partnership',
        text: isAr ? 'شراكة موثوقة' : 'Trusted Partnership',
        icon: '🤝',
        href: null,
      },
      {
        src: '/images/3d/worker_engineer.png',
        alt: 'Skilled Workers',
        text: isAr ? 'عمالة ماهرة' : 'Skilled Workers',
        icon: '⚡',
        href: null,
      },
    ],
    [isAr],
  );

  const campaignItems = useMemo<VisualItem[]>(() => {
    const icons = ['✦', '🌟', '🎯'];
    return apiBanners
      .filter((b) => !!b.image)
      .map((banner, i) => {
        const text = ((isAr ? banner.title?.ar : banner.title?.en) || banner.title?.en || banner.title?.ar || 'Campaign').trim();
        return {
          src: banner.image as string,
          alt: text,
          text,
          icon: icons[i % icons.length],
          href: resolveHref(banner, locale),
        };
      });
  }, [apiBanners, isAr, locale]);

  const items = campaignItems.length > 0 ? campaignItems : dummyItems;
  const repeated = [...items, ...items, ...items, ...items, ...items];

  return (
    <div
      className="w-full relative overflow-hidden mt-[64px] md:mt-[96px] motion-banner-wrapper sticky top-[64px] md:top-[96px] z-30 select-none"
      dir="ltr"
    >
      <style>{`
        .motion-banner-wrapper {
          height: 130px;
        }
        .banner-card {
          transform: scale(1.08);
          border-color: rgba(232,135,10,0.5);
          box-shadow: 0 4px 20px rgba(232,135,10,0.15);
        }
        .banner-avatar {
          width: 56px;
          height: 56px;
        }
        .banner-text-main {
          font-size: 16px;
        }
        .banner-label {
          font-size: 11px;
        }
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(232,135,10,0.4); }
          70% { box-shadow: 0 0 0 6px rgba(232,135,10,0); }
          100% { box-shadow: 0 0 0 0 rgba(232,135,10,0); }
        }
        .animate-marquee-banner {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: marquee-scroll 40s linear infinite;
          will-change: transform;
        }
        .animate-marquee-banner:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #091307 0%, #13240c 50%, #091307 100%)',
        }}
      />

      <div
        className="absolute inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,135,10,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,135,10,0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${3 + i * 2}px`,
              height: `${3 + i * 2}px`,
              background: 'radial-gradient(circle, rgba(232,135,10,0.6), transparent)',
              left: `${10 + i * 16}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute top-0 left-0 right-0 h-[2px] z-[5]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #E8870A 30%, #f5a623 50%, #E8870A 70%, transparent 100%)',
          boxShadow: '0 0 10px rgba(232,135,10,0.4), 0 0 20px rgba(232,135,10,0.2)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px] z-[5]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(232,135,10,0.3) 50%, transparent 100%)',
        }}
      />

      <div className="relative z-[6] flex items-center h-full w-full overflow-hidden">
        <div className="animate-marquee-banner gap-8 px-6 items-center h-full py-3">
          {repeated.map((item, i) => (
            <VisualBannerCard key={`${item.src}-${item.text}-${i}`} item={item} isAr={isAr} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
