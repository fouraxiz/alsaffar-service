import {useTranslations, useLocale} from 'next-intl';
import {Phone, ChevronDown, Star} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Orange glow */}
      <div className="absolute top-1/4 end-1/4 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT — text */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-orange/15 border border-brand-orange/30 text-brand-orange rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <Star size={13} fill="currentColor" />
              {t('badge')}
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-tight mb-5">
              {t('title')}{' '}
              <span className="text-brand-orange block mt-1">{t('titleHighlight')}</span>
            </h1>

            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">{t('subtitle')}</p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                href={`/${locale}/contact`}
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 shadow-lg shadow-brand-orange/30 hover:scale-105"
              >
                <Phone size={18} />
                {t('ctaMain')}
              </Link>
              <a
                href="https://wa.me/966XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-7 py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:scale-105"
              >
                <WhatsAppIcon />
                {t('ctaWhatsApp')}
              </a>
            </div>

            {/* Trust row */}
            <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
              {[
                {label: locale === 'ar' ? 'مرخص رسمياً' : 'Officially Licensed'},
                {label: locale === 'ar' ? 'عمالة مدققة' : 'Pre-Vetted Workers'},
                {label: locale === 'ar' ? 'ضمان استبدال' : 'Replacement Guarantee'},
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <span className="w-1.5 h-1.5 bg-brand-orange rounded-full" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — image */}
          <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Orange ring */}
              <div className="absolute -top-4 -end-4 w-full h-full rounded-3xl border-2 border-brand-orange/30 z-0" />
              {/* Image */}
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl z-10">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=700&q=85&auto=format&fit=crop"
                  alt="Professional business meeting"
                  width={560}
                  height={640}
                  className="w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
              </div>

              {/* Floating stat cards */}
              <div className="absolute -bottom-5 -start-6 z-20 bg-white rounded-2xl px-5 py-4 shadow-xl">
                <div className="text-3xl font-black text-brand-orange">5,000+</div>
                <div className="text-brand-dark text-xs font-semibold">
                  {locale === 'ar' ? 'عامل تم توظيفه' : 'Workers Placed'}
                </div>
              </div>
              <div className="absolute top-6 -start-6 z-20 bg-brand-orange text-white rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-2xl font-black">15+</div>
                <div className="text-white/90 text-xs font-semibold">
                  {locale === 'ar' ? 'سنوات خبرة' : 'Years Experience'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#stats"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-brand-orange transition-colors animate-bounce"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
}
