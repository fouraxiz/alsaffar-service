'use client';

import { useLocale } from 'next-intl';
import React from 'react';
import { Briefcase, Target, MapPin, Search, FileText } from 'lucide-react';

type PageBannerProps = {
  title: string;
  subtitle: string;
  badgeText?: string;
  iconType?: 'cv' | 'services' | 'about' | 'contact' | 'why-us';
};

export default function PageBanner({ title, subtitle, badgeText, iconType = 'services' }: PageBannerProps) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const render3DElements = () => {
    switch (iconType) {
      case 'cv':
        return (
          <>
            <div className="absolute w-48 h-64 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md transform rotate-[-15deg] -translate-x-10 shadow-2xl transition-transform duration-500 hover:rotate-[-20deg] hover:-translate-x-12" />
            <div className="absolute w-52 h-72 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 backdrop-blur-xl transform rotate-[10deg] translate-x-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col p-6 transition-transform duration-500 hover:rotate-[15deg] hover:translate-x-8 hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-[#ffb84d] mb-6 shadow-[0_0_20px_rgba(232,135,10,0.4)] group-hover:scale-110 transition-transform duration-500 flex-shrink-0 flex items-center justify-center">
                <Search className="text-white w-8 h-8" />
              </div>
              <div className="w-3/4 h-3 bg-white/20 rounded-full mb-3" />
              <div className="w-1/2 h-3 bg-white/10 rounded-full mb-8" />
              <div className="mt-auto flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="w-8 h-8 rounded-lg bg-brand-orange/80 shadow-lg shadow-orange-500/20" />
              </div>
            </div>
          </>
        );
      case 'services':
        return (
          <>
            <div className="absolute w-48 h-48 bg-white/5 rounded-full border border-white/10 backdrop-blur-md transform translate-x-10 shadow-2xl" />
            <div className="absolute w-56 h-56 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 backdrop-blur-xl transform rotate-[15deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-500 hover:rotate-[20deg] hover:scale-105 group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-orange to-[#ffb84d] shadow-[0_0_30px_rgba(232,135,10,0.5)] group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                <Briefcase className="text-white w-12 h-12" />
              </div>
            </div>
          </>
        );
      case 'about':
        return (
          <>
            <div className="absolute w-40 h-40 bg-brand-orange/20 rounded-full blur-[40px] shadow-2xl" />
            <div className="absolute w-64 h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-500 hover:scale-105 group">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-orange to-[#ffb84d] shadow-[0_0_40px_rgba(232,135,10,0.6)] group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                <Target className="text-white w-14 h-14" />
              </div>
            </div>
          </>
        );
      case 'contact':
        return (
          <>
            <div className="absolute w-32 h-64 bg-white/5 rounded-full border border-white/10 backdrop-blur-md transform rotate-45 translate-x-10 shadow-2xl" />
            <div className="absolute w-48 h-64 bg-gradient-to-br from-white/10 to-white/5 rounded-[2rem] border border-white/20 backdrop-blur-xl transform rotate-[-5deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 transition-transform duration-500 hover:rotate-0 hover:-translate-y-2 group">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-orange to-[#ffb84d] mb-6 shadow-[0_0_30px_rgba(232,135,10,0.5)] group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                <MapPin className="text-white w-10 h-10" />
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full mb-3" />
              <div className="w-3/4 h-2 bg-white/10 rounded-full" />
            </div>
          </>
        );
      case 'why-us':
        return (
          <>
            <div className="absolute w-56 h-56 bg-brand-orange/10 rounded-[3rem] border border-white/10 backdrop-blur-md transform rotate-[-10deg] shadow-2xl" />
            <div className="absolute w-56 h-56 bg-gradient-to-br from-white/10 to-white/5 rounded-[3rem] border border-white/20 backdrop-blur-xl transform rotate-[10deg] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center transition-transform duration-500 hover:rotate-12 hover:scale-105 group">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-orange to-[#ffb84d] shadow-[0_0_30px_rgba(232,135,10,0.5)] group-hover:scale-110 transition-transform duration-500 flex items-center justify-center rotate-[-10deg]">
                <FileText className="text-white w-12 h-12" />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-brand-dark">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1105] via-[#1a2e12] to-[#0a1105] z-0" />

      {/* Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-[1] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E8870A]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 z-[1]" />

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 z-[2] opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-10 md:pb-14 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl">
          {badgeText && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping absolute opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange relative" />
              <span className="text-xs md:text-sm font-bold tracking-widest text-brand-orange uppercase">
                {badgeText}
              </span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Decorative 3D Elements Area for Desktop */}
        <div className="hidden lg:flex relative w-72 h-72 justify-center items-center perspective-1000">
          {render3DElements()}
        </div>
      </div>
    </div>
  );
}
