import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import {Phone, Mail, MapPin, Clock} from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const tt = useTranslations('trust');
  const locale = useLocale();
  const year = new Date().getFullYear();

  const navLinks = [
    {href: `/${locale}`, label: tn('home')},
    {href: `/${locale}/about`, label: tn('about')},
    {href: `/${locale}/services`, label: tn('services')},
    {href: `/${locale}/contact`, label: tn('contact')},
  ];

  const trustBadges = [
    {icon: 'مساند', title: tt('musaned'), subtitle: t('musanedText')},
    {icon: 'MOL', title: tt('mol'), subtitle: t('molText')},
    {icon: 'CoC', title: tt('chamber'), subtitle: locale === 'ar' ? 'عضو غرفة التجارة' : 'Chamber Member'},
  ];

  return (
    <footer className="bg-brand-dark text-white">
      {/* Trust badges strip */}
      <div className="border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-8">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              {i > 0 && <div className="w-px h-10 bg-white/20 hidden sm:block -ms-5 me-0" />}
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-brand-dark font-black text-[10px] text-center leading-tight">{badge.icon}</span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-white">{badge.title}</div>
                <div className="text-white/60 text-xs">{badge.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="inline-flex mb-4">
              <div className="bg-white rounded-xl px-4 py-2.5">
                <img
                  src="/alsaffar.png"
                  alt="Alsaffar Manpower Recruitment"
                  className="h-11 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">{t('tagline')}</p>
            <div className="mt-4 space-y-1 text-sm">
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider">{t('cr')}: </span>
                <span className="font-semibold text-white/80">1010XXXXXX</span>
              </div>
              <div>
                <span className="text-white/40 text-xs uppercase tracking-wider">{t('license')}: </span>
                <span className="font-semibold text-white/80">XXXXXXX</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {t('quickLinks')}
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-brand-orange text-sm transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">
              {t('contact')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-white/60">
                <MapPin size={14} className="mt-0.5 text-brand-orange flex-shrink-0" />
                <a href="https://maps.google.com/?q=24.7136,46.6753" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                  {locale === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                </a>
              </li>
              <li>
                <a
                  href="tel:+966547123180"
                  className="flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors"
                >
                  <Phone size={14} className="text-brand-orange flex-shrink-0" />
                  <span dir="ltr">+966 54 712 3180</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+966545699929"
                  className="flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors"
                >
                  <Phone size={14} className="text-brand-orange flex-shrink-0" />
                  <span dir="ltr">+966 54 569 9929</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@alsaffar.com.sa"
                  className="flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors"
                >
                  <Mail size={14} className="text-brand-orange flex-shrink-0" />
                  <span>info@alsaffar.com.sa</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-white/60">
                <Clock size={14} className="mt-0.5 text-brand-orange flex-shrink-0" />
                <span className="whitespace-pre-line leading-tight">
                  {locale === 'ar' ? 'السبت إلى الخميس\n9:00 صباحاً – 12:00 مساءً\n3:00 مساءً – 9:00 مساءً' : 'Saturday to Thursday\n9:00 AM – 12:00 PM\n3:00 PM – 9:00 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>© {year} Alsaffar Manpower Recruitment. {t('rights')}</span>
          <span>الصفار للاستقدام — Riyadh, KSA</span>
        </div>
      </div>
    </footer>
  );
}
