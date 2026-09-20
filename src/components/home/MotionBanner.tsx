'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

function resolveHref(banner: ApiBanner, locale: string): string | null {
  const raw = banner.link?.href || banner.link_url;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  if (path.startsWith('/en/') || path.startsWith('/ar/')) return path;
  return `/${locale}${path}`;
}

export default function MotionBanner() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [apiBanners, setApiBanners] = useState<ApiBanner[]>([]);
  // Demo mode state for local dev when backend has no banners (0: 3d cards, 1: demo images, 2: demo text)
  const [demoMode, setDemoMode] = useState<0 | 1 | 2>(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/banners?placement=strip')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.banners)) return;
        const all = data.banners as ApiBanner[];
        // Filter specifically for strip banners or fallback to non-hero banners
        const stripOnly = all.filter((b) => b.placement === 'strip');
        const bannersToUse = stripOnly.length > 0 ? stripOnly : all.filter((b) => b.placement !== 'home_hero');
        setApiBanners(bannersToUse);
      })
      .catch(() => {
        /* keep visual marquee */
      });
    return () => {
      active = false;
    };
  }, []);

  const imageBanners = useMemo(() => {
    const fromApi = apiBanners.filter((b) => !!b.image);
    if (fromApi.length > 0) return fromApi;

    // Demo images when toggled via demo button and no live banners
    if (demoMode === 1) {
      return [
        {
          title: {
            en: 'Special Summer Campaign - Up to 20% OFF',
            ar: 'حملة الصيف الخاصة - خصم يصل إلى 20%',
          },
          image: '/images/Community_Service_Banner.png',
          link_url: '/request-cv',
          placement: 'strip',
        },
        {
          title: {
            en: 'Professional Staffing Packages for Businesses',
            ar: 'باقات كوادر مهنية متخصصة للشركات',
          },
          image: '/images/volunteers-strip.png',
          link_url: '/services',
          placement: 'strip',
        },
      ] as ApiBanner[];
    }

    return [];
  }, [apiBanners, demoMode]);

  // STABLE overflow checker: measures the permanent offscreen track that never mutates
  const checkOverflow = useCallback(() => {
    if (!containerRef.current || !measureTrackRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const contentWidth = measureTrackRef.current.scrollWidth;

    if (containerWidth <= 0 || contentWidth <= 0) return;

    // True overflow: only when content exceeds container width with 24px safety margin
    const overflows = contentWidth > containerWidth - 24;
    setIsOverflowing((prev) => (prev !== overflows ? overflows : prev));
  }, []);

  const textCampaignItems = useMemo(() => {
    if (imageBanners.length > 0) return [] as Array<{ text: string; href: string | null }>;
    const fromApi = apiBanners
      .map((b) => {
        const text = ((isAr ? b.title?.ar : b.title?.en) || b.title?.en || '').trim();
        if (!text) return null;
        return { text, href: resolveHref(b, locale) };
      })
      .filter((item): item is { text: string; href: string | null } => !!item);
    if (fromApi.length > 0) return fromApi;

    if (demoMode === 2) {
      const demo = isAr
        ? [
            '🚀 خصم 20% على باقات الاستقدام للشركات هذا الأسبوع!',
            '🌟 استقدم الآن وادفع لاحقاً - حملة الصيف',
            '👨‍🔧 عمالة فورية جاهزة لنقل الكفالة',
          ]
        : [
            '🚀 20% OFF Corporate Staffing Packages this week!',
            '🌟 Hire Now, Pay Later - Summer Campaign',
            '👨‍🔧 Immediate Available Workers for Transfer',
          ];
      return demo.map((text) => ({ text, href: null as string | null }));
    }

    return [];
  }, [apiBanners, demoMode, imageBanners.length, isAr, locale]);

  const showImageStrip = imageBanners.length > 0;
  const hasActiveCampaign = textCampaignItems.length > 0;

  // Measure overflow accurately and smoothly without rapid re-render loops
  useEffect(() => {
    if (!showImageStrip) return;

    checkOverflow();

    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      checkOverflow();
    });
    observer.observe(container);
    window.addEventListener('resize', checkOverflow);

    const t1 = setTimeout(checkOverflow, 200);
    const t2 = setTimeout(checkOverflow, 800);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [checkOverflow, showImageStrip, imageBanners]);

  // For continuous seamless marquee when overflowing
  const repeatedBanners = useMemo(() => {
    if (imageBanners.length === 0) return [];
    // Ensure sufficient items to span full screen width before duplicating
    if (imageBanners.length === 1) return [...imageBanners, ...imageBanners, ...imageBanners, ...imageBanners];
    if (imageBanners.length === 2) return [...imageBanners, ...imageBanners];
    return imageBanners;
  }, [imageBanners]);

  const marqueeDuration = useMemo(() => {
    return Math.max(25, repeatedBanners.length * 12);
  }, [repeatedBanners.length]);

  const visualItems = [
    { src: '/images/3d/worker_office.png', alt: 'Professional Staffing', text: isAr ? 'كوادر مهنية' : 'Professional Staffing', icon: '🏢' },
    { src: '/images/3d/handshake.png', alt: 'Trusted Partnership', text: isAr ? 'شراكة موثوقة' : 'Trusted Partnership', icon: '🤝' },
    { src: '/images/3d/worker_engineer.png', alt: 'Skilled Workers', text: isAr ? 'عمالة ماهرة' : 'Skilled Workers', icon: '⚡' },
  ];

  const repeatedCampaign = [...textCampaignItems, ...textCampaignItems, ...textCampaignItems, ...textCampaignItems];
  const repeatedVisuals = [...visualItems, ...visualItems, ...visualItems, ...visualItems, ...visualItems];

  const renderBannerCard = (banner: ApiBanner, key: string | number) => {
    const href = resolveHref(banner, locale);
    const title = ((isAr ? banner.title?.ar : banner.title?.en) || banner.title?.en || 'Promotion').trim();
    const isExternal = href?.startsWith('http');

    const cardContent = (
      <div className="relative h-full flex-shrink-0 flex items-center justify-center rounded-2xl p-1 md:p-1.5 transition-all duration-300 group/banner overflow-hidden border border-brand-orange/30 hover:border-brand-orange bg-gradient-to-b from-white/[0.08] to-white/[0.02] hover:from-white/[0.14] hover:to-white/[0.05] backdrop-blur-sm shadow-[0_4px_16px_rgba(0,0,0,0.35)] hover:shadow-[0_6px_24px_rgba(232,135,10,0.25)] hover:scale-[1.03]">
        {/* Subtle top gold accent line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-brand-orange/60 to-transparent opacity-60 group-hover/banner:opacity-100 transition-opacity" />

        {/* Banner image with preserved aspect ratio */}
        <img
          src={banner.image || ''}
          alt={title}
          title={title}
          className="h-full w-auto max-h-full object-contain rounded-xl block select-none pointer-events-none"
        />
      </div>
    );

    if (href) {
      return (
        <Link
          key={key}
          href={href}
          className="h-full flex-shrink-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-2xl"
          aria-label={title}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
        >
          {cardContent}
        </Link>
      );
    }

    return (
      <div key={key} className="h-full flex-shrink-0">
        {cardContent}
      </div>
    );
  };

  return (
    <>
      <div
        className="w-full relative overflow-hidden mt-[64px] md:mt-[96px] motion-banner-wrapper sticky top-[64px] md:top-[96px] z-30 select-none"
        dir="ltr"
      >
        <style>{`
        .motion-banner-wrapper {
          height: ${showImageStrip ? '100px' : hasActiveCampaign ? '70px' : '130px'};
        }
        @media (min-width: 640px) {
          .motion-banner-wrapper {
            height: ${showImageStrip ? '120px' : hasActiveCampaign ? '70px' : '130px'};
          }
        }
        @media (min-width: 768px) {
          .motion-banner-wrapper {
            height: ${showImageStrip ? '140px' : hasActiveCampaign ? '70px' : '130px'};
          }
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
        @keyframes bannerMarqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .banner-marquee-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          width: max-content;
          animation: bannerMarqueeScroll linear infinite;
          will-change: transform;
        }
        .banner-marquee-track:hover {
          animation-play-state: paused;
        }
        .banner-marquee-paused {
          animation-play-state: paused !important;
        }
        @keyframes marquee-scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
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
        .shimmer-text {
          background: linear-gradient(90deg, #f0e6d4 0%, #ffd700 25%, #f0e6d4 50%, #ffd700 75%, #f0e6d4 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
      `}</style>

        {/* Stable Luxury deep green gradient background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #091307 0%, #13240c 50%, #091307 100%)',
          }}
        />

        {!showImageStrip && (
          <>
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
          </>
        )}

        {/* Gold accent borders */}
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

        {/* Permanent hidden measurement track to reliably test if banners fit in 1 line */}
        {showImageStrip && (
          <div
            ref={measureTrackRef}
            aria-hidden="true"
            className="absolute left-0 top-0 opacity-0 pointer-events-none -z-50 flex items-center gap-4 sm:gap-6 md:gap-8 flex-nowrap"
            style={{ visibility: 'hidden', height: '100%', width: 'max-content' }}
          >
            {imageBanners.map((banner, i) => (
              <div key={`measure-${i}`} className="h-full flex-shrink-0 flex items-center">
                <img
                  src={banner.image || ''}
                  alt=""
                  onLoad={checkOverflow}
                  className="h-full w-auto object-contain"
                />
              </div>
            ))}
          </div>
        )}

        <div ref={containerRef} className="relative z-[6] flex items-center h-full w-full overflow-hidden">
          {showImageStrip ? (
            /* --- UPLOADED IMAGE BANNERS --- */
            <div
              className="relative w-full h-full flex items-center overflow-hidden py-1.5 md:py-2.5"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
            >
              {/* If images fit in 1 line: show centered in 1 line without any scrolling */}
              {!isOverflowing ? (
                <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 h-full w-full px-4">
                  {imageBanners.map((banner, i) => renderBannerCard(banner, `static-${i}`))}
                </div>
              ) : (
                /* If NOT set in 1 line (overflows container): smoothly auto-move horizontally */
                <div className="relative w-full h-full flex items-center overflow-hidden">
                  {/* Left & right edge fade masks */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 z-10 pointer-events-none bg-gradient-to-r from-[#091307] via-[#091307]/80 to-transparent" />
                  <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 z-10 pointer-events-none bg-gradient-to-l from-[#091307] via-[#091307]/80 to-transparent" />

                  {/* Hardware-accelerated continuous moving marquee track */}
                  <div
                    className={`banner-marquee-track gap-4 sm:gap-6 md:gap-8 h-full px-2 ${
                      isHovered ? 'banner-marquee-paused' : ''
                    }`}
                    style={{
                      animationDuration: `${marqueeDuration}s`,
                    }}
                  >
                    {/* First copy */}
                    {repeatedBanners.map((banner, i) => renderBannerCard(banner, `rep1-${i}`))}
                    {/* Second copy for seamless 50% loop */}
                    {repeatedBanners.map((banner, i) => renderBannerCard(banner, `rep2-${i}`))}
                  </div>
                </div>
              )}
            </div>
          ) : hasActiveCampaign ? (
            /* --- TEXT CAMPAIGN MODE --- */
            <div className="animate-marquee-banner gap-16 px-6 items-center h-full py-3">
              {repeatedCampaign.map((item, i) => {
                const inner = (
                  <>
                    <span
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-sm"
                      style={{
                        animation: 'pulseRing 2s infinite',
                        animationDelay: `${(i % 3) * 0.6}s`,
                      }}
                    >
                      ✦
                    </span>
                    <span dir={isAr ? 'rtl' : 'ltr'} className="shimmer-text font-black text-sm md:text-base tracking-wide">
                      {item.text}
                    </span>
                  </>
                );
                return (
                  <div key={i} className="flex items-center gap-4">
                    {item.href ? (
                      <Link href={item.href} className="flex items-center gap-4 hover:opacity-90">
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* --- 3D VISUALS MODE --- */
            <div className="animate-marquee-banner gap-8 px-6 items-center h-full py-3">
              {repeatedVisuals.map((item, i) => (
                <div
                  key={i}
                  className="banner-card group flex items-center gap-3 rounded-2xl px-2 py-1.5 cursor-default"
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
                        animationDelay: `${(i % 3) * 0.8}s`,
                      }}
                    />
                    <div
                      className="banner-avatar relative rounded-full overflow-hidden border-2 border-brand-orange/60"
                      style={{
                        boxShadow: '0 0 12px rgba(232,135,10,0.3)',
                      }}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="object-cover object-center scale-110 w-full h-full"
                      />
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
              ))}
            </div>
          )}
        </div>
      </div>

      {apiBanners.length === 0 ? (
        <button
          type="button"
          onClick={() => setDemoMode((m) => ((m + 1) % 3) as 0 | 1 | 2)}
          className="fixed bottom-6 left-6 z-50 bg-brand-dark/90 text-brand-orange border border-brand-orange/30 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-black hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full animate-pulse bg-brand-orange"></span>
          Demo: {demoMode === 0 ? '3D Visuals' : demoMode === 1 ? 'Image Banners' : 'Text Campaign'}
        </button>
      ) : null}
    </>
  );
}
