'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
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

function resolveHref(banner: ApiBanner, locale: string): string | null {
  const raw = banner.link?.href || banner.link_url;
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  // Locale-prefixed internal paths: /en/request-cv?nationality=tz
  if (path.startsWith('/en/') || path.startsWith('/ar/')) return path;
  return `/${locale}${path}`;
}

export default function MotionBanner() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [apiBanners, setApiBanners] = useState<ApiBanner[]>([]);
  // Fallback demo toggle only when ERP has no live banners.
  const [demoCampaign, setDemoCampaign] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    let active = true;
    fetch('/api/banners')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.banners)) return;
        setApiBanners(data.banners as ApiBanner[]);
      })
      .catch(() => {
        /* keep visual marquee */
      });
    return () => {
      active = false;
    };
  }, []);

  const imageBanners = useMemo(
    () => apiBanners.filter((b) => !!b.image),
    [apiBanners],
  );

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
  }, [apiBanners, imageBanners.length, isAr, locale]);

  const showImageStrip = imageBanners.length > 0;
  const hasActiveCampaign = apiBanners.length > 0 || demoCampaign;

  useEffect(() => {
    if (imageBanners.length <= 1) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % imageBanners.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [imageBanners.length]);

  const visualItems = [
    { src: '/images/3d/worker_office.png', alt: 'Professional Staffing', text: isAr ? 'كوادر مهنية' : 'Professional Staffing', icon: '🏢' },
    { src: '/images/3d/handshake.png', alt: 'Trusted Partnership', text: isAr ? 'شراكة موثوقة' : 'Trusted Partnership', icon: '🤝' },
    { src: '/images/3d/worker_engineer.png', alt: 'Skilled Workers', text: isAr ? 'عمالة ماهرة' : 'Skilled Workers', icon: '⚡' },
  ];

  const repeatedCampaign = [...textCampaignItems, ...textCampaignItems, ...textCampaignItems, ...textCampaignItems];
  const repeatedVisuals = [...visualItems, ...visualItems, ...visualItems, ...visualItems, ...visualItems];

  const activeImage = imageBanners[slide] || imageBanners[0];
  const activeHref = activeImage ? resolveHref(activeImage, locale) : null;
  const activeTitle =
    (isAr ? activeImage?.title?.ar : activeImage?.title?.en)?.trim() ||
    activeImage?.title?.en ||
    'Promotion';
  const erpImageUnoptimized = !!(activeImage?.image && !activeImage.image.includes('images.unsplash.com'));

  return (
    <>
      <div
        className="w-full relative overflow-hidden mt-[64px] md:mt-[96px] motion-banner-wrapper sticky top-[64px] md:top-[96px] z-30"
        dir="ltr"
      >
        <style>{`
        .motion-banner-wrapper {
          height: ${showImageStrip ? '160px' : hasActiveCampaign ? '70px' : '130px'};
        }
        @media (min-width: 768px) {
          .motion-banner-wrapper {
            height: ${showImageStrip ? '220px' : hasActiveCampaign ? '70px' : '130px'};
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
      `}</style>

        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0" style={{
          background: 'linear-gradient(135deg, #0d1a0a 0%, #1a2f10 25%, #243a18 50%, #1a2f10 75%, #0d1a0a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
        }} />

        {!showImageStrip && (
          <>
            <div className="absolute inset-0 z-[1] opacity-[0.06]" style={{
              backgroundImage: 'linear-gradient(rgba(232,135,10,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,135,10,0.5) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }} />
            <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute rounded-full" style={{
                  width: `${3 + i * 2}px`,
                  height: `${3 + i * 2}px`,
                  background: 'radial-gradient(circle, rgba(232,135,10,0.6), transparent)',
                  left: `${10 + i * 16}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animation: `floatParticle ${3 + i * 0.7}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.5}s`,
                }} />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-0 left-0 right-0 h-[2px] z-[5]" style={{
          background: 'linear-gradient(90deg, transparent 0%, #E8870A 30%, #f5a623 50%, #E8870A 70%, transparent 100%)',
          boxShadow: '0 0 10px rgba(232,135,10,0.4), 0 0 20px rgba(232,135,10,0.2)',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] z-[5]" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(232,135,10,0.3) 50%, transparent 100%)',
        }} />

        <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-15px) scale(1.5); opacity: 0.8; }
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

        <div className="relative z-[6] flex items-center h-full">
          {showImageStrip && activeImage?.image ? (
            /* --- UPLOADED BANNER IMAGES (full art, no circular crop) --- */
            <div className="relative w-full h-full">
              {activeHref ? (
                <Link
                  href={activeHref}
                  className="absolute inset-0 block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  aria-label={activeTitle}
                >
                  <Image
                    src={activeImage.image}
                    alt={activeTitle}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain object-center"
                    unoptimized={erpImageUnoptimized}
                  />
                </Link>
              ) : (
                <div className="absolute inset-0">
                  <Image
                    src={activeImage.image}
                    alt={activeTitle}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain object-center"
                    unoptimized={erpImageUnoptimized}
                  />
                </div>
              )}

              {imageBanners.length > 1 && (
                <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                  {imageBanners.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Banner ${i + 1}`}
                      onClick={() => setSlide(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === slide ? 'w-6 bg-brand-orange' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : hasActiveCampaign ? (
            /* --- TEXT CAMPAIGN MODE (titles only / demo) --- */
            <div className="animate-marquee-banner gap-16 px-6 items-center h-full py-3">
              {repeatedCampaign.map((item, i) => {
                const inner = (
                  <>
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-sm" style={{
                      animation: 'pulseRing 2s infinite',
                      animationDelay: `${(i % 3) * 0.6}s`,
                    }}>✦</span>
                    <span dir={isAr ? 'rtl' : 'ltr'} className="shimmer-text font-black text-sm md:text-base tracking-wide">{item.text}</span>
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
                <div key={i} className="banner-card group flex items-center gap-3 rounded-2xl px-2 py-1.5 cursor-default"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(232,135,10,0.08) 100%)',
                    border: '1px solid rgba(232,135,10,0.5)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-full opacity-100" style={{
                      background: 'conic-gradient(from 0deg, #E8870A, #1A1F00, #E8870A)',
                      animation: 'pulseRing 2.5s infinite',
                      animationDelay: `${(i % 3) * 0.8}s`,
                    }} />
                    <div className="banner-avatar relative rounded-full overflow-hidden border-2 border-brand-orange/60" style={{
                      boxShadow: '0 0 12px rgba(232,135,10,0.3)',
                    }}>
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover object-center scale-110"
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
                  <div className="text-brand-orange/40 group-hover:text-brand-orange/80 transition-colors text-lg">
                    ›
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {apiBanners.length === 0 ? (
        <button
          type="button"
          onClick={() => setDemoCampaign((v) => !v)}
          className="fixed bottom-6 left-6 z-50 bg-brand-dark/90 text-brand-orange border border-brand-orange/30 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-black hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full animate-pulse bg-brand-orange"></span>
          Demo: Switch Banner Style
        </button>
      ) : null}
    </>
  );
}
