'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Phone, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import HeroImageRotator from './HeroImageRotator';

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white/80 via-brand-light/80 to-orange-50/80">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #E8870A 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      {/* Soft orange glow top-right */}
      <div className="absolute top-0 end-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      {/* Soft glow bottom-left */}
      <div className="absolute bottom-0 start-0 w-96 h-96 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — text */}
          <div className="order-2 lg:order-1">
            {/* Licensed badge */}
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/25 text-brand-orange rounded-full px-4 py-1.5 text-sm font-bold mb-6">
              <span className="w-2 h-2 bg-brand-orange rounded-full animate-pulse" />
              {isAr ? 'مرخّص رسمياً من وزارة الموارد البشرية' : 'Officially Licensed by Ministry of HR'}
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-brand-dark leading-tight mb-5">
              {t('title')}{' '}
              <span className="text-brand-orange block mt-1">{t('titleHighlight')}</span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-lg">{t('subtitle')}</p>

            {/* Contact CTA buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Link
                href={`/${locale}/request-cv`}
                className="flex items-center gap-1.5 bg-[#16201a] hover:bg-[#23332a] text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-gray-300"
              >
                <Users size={16} />
                {isAr ? 'تصفح السير الذاتية' : 'Browse CVs'}
              </Link>
              <a
                href="https://wa.me/966920021201"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-green-200"
              >
                <WhatsAppIcon size={16} />
                {isAr ? 'واتساب الآن' : 'WhatsApp Now'}
              </a>
              <a
                href="tel:+966920021201"
                className="flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-orange-200"
              >
                <Phone size={16} />
                {isAr ? 'اتصل بنا' : 'Call Us'}
              </a>
              <a
                href="https://maps.app.goo.gl/qzWGFysrc4hP25Zv6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 shadow-lg shadow-sky-200"
              >
                <MapPin size={16} />
                {isAr ? 'موقعنا' : 'Our Location'}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
              {[
                isAr ? 'مرخص رسمياً' : 'Officially Licensed',
                isAr ? 'عمالة مدققة' : 'Pre-Vetted Workers',
                isAr ? 'ضمان استبدال' : 'Replacement Guarantee',
                isAr ? 'خبرة +15 سنة' : '15+ Years Experience',
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-brand-orange rounded-full" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — image with stats */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Orange decorative ring */}
              <div className="absolute -top-4 -end-4 w-full h-full rounded-3xl border-2 border-brand-orange/20 z-0" />
              {/* Rotating images */}
              <HeroImageRotator />

              {/* Floating stat card — bottom */}
              <div className="absolute -bottom-5 -start-6 z-20 bg-white rounded-2xl px-5 py-4 shadow-xl border border-orange-100 animate-float-delayed">
                <div className="text-3xl font-black text-brand-orange">5,000+</div>
                <div className="text-brand-dark text-xs font-semibold">
                  {isAr ? 'عامل تم توظيفه' : 'Workers Placed'}
                </div>
              </div>
              {/* Floating stat card — top */}
              <div className="absolute top-6 -start-6 z-20 bg-brand-orange text-white rounded-2xl px-4 py-3 shadow-xl animate-float flex items-center gap-3">
                <div>
                  <div className="text-2xl font-black">15+</div>
                  <div className="text-white/90 text-xs font-semibold">
                    {isAr ? 'سنوات خبرة' : 'Years Experience'}
                  </div>
                </div>
                {/* Rotating subtle visual */}
                <svg className="w-8 h-8 opacity-40 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5l-10 14M22 12H2M19 19L5 5" />
                </svg>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Scroll hint */}
      <Link
        href={`/${locale}/contact`}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 hover:text-brand-orange transition-colors text-xs font-semibold"
      >
        <span>{isAr ? 'تواصل معنا' : 'Get in Touch'}</span>
        <svg className="animate-bounce" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 9l-7 7-7-7" /></svg>
      </Link>
    </section>
  );
}
