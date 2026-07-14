'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useSite } from '@/components/site/SiteProvider';

export default function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const tt = useTranslations('trust');
  const locale = useLocale();
  const site = useSite();
  const isAr = locale === 'ar';
  const year = new Date().getFullYear();

  const brandName = (isAr ? site.name.ar : site.name.en) || 'Alsaffar';
  const tagline = (isAr ? site.tagline.ar : site.tagline.en) || t('tagline');
  const address = (isAr ? site.address.ar : site.address.en) || '';
  const hours = (isAr ? site.hours.ar : site.hours.en) || '';
  const phoneDisplay = site.phone || '';
  const phoneHref = site.phone_tel || '#';
  const email = site.email || '';
  const mapLink = site.map_link_url || '#';
  const mapEmbed = site.map_embed_url || '';

  const navLinks = [
    { href: `/${locale}`, label: tn('home') },
    { href: `/${locale}/about`, label: tn('about') },
    { href: `/${locale}/services`, label: tn('services') },
    { href: `/${locale}/contact`, label: tn('contact') },
  ];

  const trustBadges = [
    { icon: 'مساند', title: tt('musaned'), subtitle: t('musanedText') },
    { icon: 'MOL', title: tt('mol'), subtitle: t('molText') },
    { icon: 'CoC', title: tt('chamber'), subtitle: isAr ? 'عضو غرفة التجارة' : 'Chamber Member' },
  ];

  return (
    <footer className="bg-brand-dark text-white">
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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex mb-4">
              <div className="bg-white rounded-xl px-4 py-2.5">
                <img
                  src={site.logo_url || '/alsaffar.png'}
                  alt={brandName}
                  className="h-11 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">{tagline}</p>
            <div className="mt-4 space-y-1 text-sm">
              {site.cr_number ? (
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">{t('cr')}: </span>
                  <span className="font-semibold text-white/80">{site.cr_number}</span>
                </div>
              ) : null}
              {site.license_number ? (
                <div>
                  <span className="text-white/40 text-xs uppercase tracking-wider">{t('license')}: </span>
                  <span className="font-semibold text-white/80">{site.license_number}</span>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{t('quickLinks')}</h3>
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

          <div>
            <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{t('contact')}</h3>
            <ul className="space-y-3 text-sm">
              {address ? (
                <li className="flex items-start gap-2 text-white/60">
                  <MapPin size={16} className="mt-0.5 text-brand-orange flex-shrink-0" />
                  <a href={mapLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                    {address}
                  </a>
                </li>
              ) : null}
              {phoneDisplay ? (
                <li>
                  <a href={phoneHref} className="flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors">
                    <Phone size={14} className="text-brand-orange flex-shrink-0" />
                    <span dir="ltr">{phoneDisplay}</span>
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-white/60 hover:text-brand-orange transition-colors">
                    <Mail size={14} className="text-brand-orange flex-shrink-0" />
                    <span>{email}</span>
                  </a>
                </li>
              ) : null}
              {hours ? (
                <li className="flex items-start gap-2 text-white/60">
                  <Clock size={14} className="mt-0.5 text-brand-orange flex-shrink-0" />
                  <span className="whitespace-pre-line leading-tight">{hours}</span>
                </li>
              ) : null}
            </ul>
          </div>

          <div className="h-48 lg:h-full w-full min-h-[200px] rounded-xl overflow-hidden border border-white/10 relative">
            {mapEmbed ? (
              <iframe
                src={mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={brandName}
                className="absolute inset-0"
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>
            © {year} {brandName}. {t('rights')}
          </span>
          <span>{(isAr ? site.name.ar : site.name.en) || brandName}</span>
        </div>
      </div>
    </footer>
  );
}
