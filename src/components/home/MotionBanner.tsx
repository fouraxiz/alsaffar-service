'use client';

import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

export default function MotionBanner() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  // Toggle state so you can easily switch during client demo
  const [hasActiveCampaign, setHasActiveCampaign] = useState(false);

  const campaignItems = isAr
    ? [
      "🚀 خصم 20% على باقات الاستقدام للشركات هذا الأسبوع!",
      "🌟 استقدم الآن وادفع لاحقاً - حملة الصيف",
      "👨‍🔧 عمالة فورية جاهزة لنقل الكفالة"
    ]
    : [
      "🚀 20% OFF Corporate Staffing Packages this week!",
      "🌟 Hire Now, Pay Later - Summer Campaign",
      "👨‍🔧 Immediate Available Workers for Transfer"
    ];

  const visualItems = [
    { src: '/images/3d/worker_office.png', alt: 'Professional Staffing', text: isAr ? 'كوادر مهنية' : 'Professional Staffing', icon: '🏢' },
    { src: '/images/3d/handshake.png', alt: 'Trusted Partnership', text: isAr ? 'شراكة موثوقة' : 'Trusted Partnership', icon: '🤝' },
    { src: '/images/3d/worker_engineer.png', alt: 'Skilled Workers', text: isAr ? 'عمالة ماهرة' : 'Skilled Workers', icon: '⚡' },
  ];

  const repeatedCampaign = [...campaignItems, ...campaignItems, ...campaignItems, ...campaignItems];
  const repeatedVisuals = [...visualItems, ...visualItems, ...visualItems, ...visualItems, ...visualItems];

  return (
    <>
      <div
        className="w-full relative overflow-hidden mt-[64px] md:mt-[96px] motion-banner-wrapper sticky top-[64px] md:top-[96px] z-30"
        dir="ltr"
      >

        <style>{`
        .motion-banner-wrapper {
          height: ${hasActiveCampaign ? '52px' : '80px'};
          transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .motion-banner-wrapper:hover {
          height: ${hasActiveCampaign ? '70px' : '130px'};
        }
        .motion-banner-wrapper:hover .banner-card {
          transform: scale(1.08);
          border-color: rgba(232,135,10,0.5);
          box-shadow: 0 4px 20px rgba(232,135,10,0.15);
        }
        .motion-banner-wrapper:hover .banner-avatar {
          width: 56px;
          height: 56px;
        }
        .motion-banner-wrapper:hover .banner-text-main {
          font-size: 16px;
        }
        .motion-banner-wrapper:hover .banner-label {
          font-size: 11px;
        }
      `}</style>
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0" style={{
          background: 'linear-gradient(135deg, #0d1a0a 0%, #1a2f10 25%, #243a18 50%, #1a2f10 75%, #0d1a0a 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
        }} />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.06]" style={{
          backgroundImage: 'linear-gradient(rgba(232,135,10,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(232,135,10,0.5) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Floating particles */}
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

        {/* Top accent line - orange glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-[5]" style={{
          background: 'linear-gradient(90deg, transparent 0%, #E8870A 30%, #f5a623 50%, #E8870A 70%, transparent 100%)',
          boxShadow: '0 0 10px rgba(232,135,10,0.4), 0 0 20px rgba(232,135,10,0.2)',
        }} />

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] z-[5]" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(232,135,10,0.3) 50%, transparent 100%)',
        }} />

        {/* Edge fade gradients */}
        <div className="absolute inset-y-0 left-0 w-32 md:w-48 z-[8] pointer-events-none" style={{
          background: 'linear-gradient(90deg, #0d1a0a 0%, transparent 100%)',
        }} />
        <div className="absolute inset-y-0 right-0 w-32 md:w-48 z-[8] pointer-events-none" style={{
          background: 'linear-gradient(270deg, #0d1a0a 0%, transparent 100%)',
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

        {/* Content */}
        <div className="relative z-[6] flex items-center h-full">
          {hasActiveCampaign ? (
            /* --- CAMPAIGN MODE --- */
            <div className="animate-marquee-banner gap-16 px-6 items-center h-full py-3">
              {repeatedCampaign.map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-sm" style={{
                    animation: 'pulseRing 2s infinite',
                    animationDelay: `${(i % 3) * 0.6}s`,
                  }}>✦</span>
                  <span dir={isAr ? 'rtl' : 'ltr'} className="shimmer-text font-black text-sm md:text-base tracking-wide">{text}</span>
                </div>
              ))}
            </div>
          ) : (
            /* --- 3D VISUALS MODE --- */
            <div className="animate-marquee-banner gap-8 px-6 items-center h-full py-3">
              {repeatedVisuals.map((item, i) => (
                <div key={i} className="banner-card group flex items-center gap-3 rounded-2xl px-2 py-1.5 cursor-default"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(232,135,10,0.08) 100%)',
                    border: '1px solid rgba(232,135,10,0.2)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {/* Glowing avatar */}
                  <div className="relative shrink-0">
                    <div className="absolute -inset-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" style={{
                      background: 'conic-gradient(from 0deg, #E8870A, #1A1F00, #E8870A)',
                      animation: 'pulseRing 2.5s infinite',
                      animationDelay: `${(i % 3) * 0.8}s`,
                    }} />
                    <div className="banner-avatar relative rounded-full overflow-hidden border-2 border-brand-orange/60" style={{
                      boxShadow: '0 0 12px rgba(232,135,10,0.3)',
                      width: '48px',
                      height: '48px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover object-center scale-110"
                      />
                    </div>
                  </div>

                  {/* Text with icon */}
                  <div className="flex flex-col pe-4">
                    <span className="banner-label text-brand-orange/80 font-medium tracking-widest uppercase" style={{ fontSize: '10px', transition: 'font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                      {item.icon} {isAr ? 'الصّفّار' : 'ALSAFFAR'}
                    </span>
                    <span
                      dir={isAr ? 'rtl' : 'ltr'}
                      className="banner-text-main font-bold tracking-wide text-white group-hover:text-brand-orange"
                      style={{ fontSize: '14px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {item.text}
                    </span>
                  </div>

                  {/* Decorative arrow */}
                  <div className="text-brand-orange/40 group-hover:text-brand-orange/80 transition-colors text-lg">
                    ›
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DEMO TOGGLE BUTTON - ONLY FOR PRESENTATION */}
      <button
        onClick={() => setHasActiveCampaign(!hasActiveCampaign)}
        className="fixed bottom-6 left-6 z-50 bg-brand-dark/90 text-brand-orange border border-brand-orange/30 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-black hover:scale-105 transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full animate-pulse bg-brand-orange"></span>
        Demo: Switch Banner Style
      </button>
    </>
  );
}
