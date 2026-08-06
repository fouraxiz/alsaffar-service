'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Menu, X, Phone } from 'lucide-react';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';
import { useSite } from '@/components/site/SiteProvider';
import { usePortalUrl } from '@/hooks/usePortalUrl';

const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const AlsaffarLogoSVG = () => (
  <svg width="160" height="48" viewBox="0 0 160 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="24,4 6,42 42,42" fill="none" stroke="#E8870A" strokeWidth="3.5" strokeLinejoin="round" />
    <line x1="11" y1="30" x2="37" y2="30" stroke="#E8870A" strokeWidth="3" />
    <line x1="3" y1="26" x2="8" y2="26" stroke="#E8870A" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="40" y1="26" x2="45" y2="26" stroke="#E8870A" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="20" cy="21" r="3" fill="#1A1F00" />
    <circle cx="28" cy="21" r="3" fill="#1A1F00" />
    <path d="M17 24 Q24 27 31 24" stroke="#1A1F00" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <text x="52" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="17" fill="#1A1F00" letterSpacing="0.5">ALSAFFAR</text>
    <text x="52" y="36" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="8" fill="#E8870A" letterSpacing="1.5">MANPOWER RECRUITMENT</text>
    <text x="52" y="47" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9" fill="#1A1F00" letterSpacing="0.3">الصفار للاستقدام</text>
  </svg>
);

function LogoMark({ logoUrl, alt }: { logoUrl: string | null; alt: string }) {
  const [broken, setBroken] = useState(false);

  if (!logoUrl || broken) {
    return <AlsaffarLogoSVG />;
  }

  return (
    <img
      src={logoUrl}
      alt={alt}
      className="h-12 w-auto object-contain"
      onError={() => setBroken(true)}
    />
  );
}

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const site = useSite();
  const portalUrl = usePortalUrl();
  const isAr = locale === 'ar';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const brandName = (isAr ? site.name.ar : site.name.en) || 'Alsaffar';
  const phoneDisplay = site.phone || '+966 920 021 201';
  const phoneHref = site.phone_tel || 'tel:+966920021201';
  const waHref = site.whatsapp_url || 'https://wa.me/966920021201';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/request-cv`, label: locale === 'ar' ? 'تصفح العمالة' : 'Browse CVs' },
    { href: `/${locale}/why-us`, label: t('whyUs') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  const isActive = (href: string) => {
    if (href.includes('#')) return false;
    if (href === `/${locale}`) return pathname === '/';
    return pathname.startsWith(href.replace(`/${locale}`, ''));
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="bg-brand-dark text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-5 text-white/70">
            {site.cr_number ? (
              <span>
                <span className="text-white/40 me-1">{isAr ? 'س.ت:' : 'CR:'}</span>
                <span className="text-white font-semibold">{site.cr_number}</span>
              </span>
            ) : null}
            {site.cr_number && site.license_number ? <span className="text-white/20">|</span> : null}
            {site.license_number ? (
              <span>
                <span className="text-white/40 me-1">{isAr ? 'رخصة:' : 'License:'}</span>
                <span className="text-white font-semibold">{site.license_number}</span>
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#25D366] hover:text-[#1ebe5d] transition-colors font-semibold"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </a>
            <a
              href={phoneHref}
              className="flex items-center gap-1.5 text-white/70 hover:text-brand-orange transition-colors"
            >
              <Phone size={12} />
              <span dir="ltr">{phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center">
            <LogoMark logoUrl={site.logo_url} alt={brandName} />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-brand-orange bg-brand-light'
                    : 'text-brand-dark hover:text-brand-orange hover:bg-brand-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <div className="hidden md:flex items-center gap-1.5">
              <a
                href={`${portalUrl}/login?portal=customer`}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold text-brand-dark hover:text-brand-orange hover:bg-brand-light transition-colors"
              >
                {isAr ? 'عميل' : 'Customer'} {isAr ? 'دخول' : 'Sign In'}
              </a>
              <a
                href={`${portalUrl}/register?portal=customer`}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold border border-brand-orange text-brand-orange hover:bg-brand-light transition-colors"
              >
                {isAr ? 'تسجيل عميل' : 'Customer Sign up'}
              </a>
              <a
                href={`${portalUrl}/login?portal=vendor`}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold text-brand-dark hover:text-brand-orange hover:bg-brand-light transition-colors"
              >
                {isAr ? 'مورد' : 'Vendor'} {isAr ? 'دخول' : 'Sign In'}
              </a>
              <a
                href={`${portalUrl}/register?portal=vendor`}
                className="inline-flex items-center px-3 py-2 rounded-lg text-xs font-bold bg-brand-orange hover:bg-[#C47208] text-white transition-colors"
              >
                {isAr ? 'تسجيل مورد' : 'Vendor Sign up'}
              </a>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors duration-200"
            >
              <WhatsAppIcon />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-brand-dark hover:bg-brand-light transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-orange bg-brand-light'
                    : 'text-brand-dark hover:text-brand-orange hover:bg-brand-light'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-1 border-t border-gray-100 mt-1 flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`${portalUrl}/login?portal=customer`}
                  className="text-center py-2.5 rounded-lg border border-brand-orange text-brand-orange text-xs font-bold"
                >
                  {isAr ? 'دخول عميل' : 'Customer Sign In'}
                </a>
                <a
                  href={`${portalUrl}/register?portal=customer`}
                  className="text-center py-2.5 rounded-lg bg-brand-orange text-white text-xs font-bold"
                >
                  {isAr ? 'تسجيل عميل' : 'Customer Sign up'}
                </a>
                <a
                  href={`${portalUrl}/login?portal=vendor`}
                  className="text-center py-2.5 rounded-lg border border-brand-dark text-brand-dark text-xs font-bold"
                >
                  {isAr ? 'دخول مورد' : 'Vendor Sign In'}
                </a>
                <a
                  href={`${portalUrl}/register?portal=vendor`}
                  className="text-center py-2.5 rounded-lg bg-brand-dark text-white text-xs font-bold"
                >
                  {isAr ? 'تسجيل مورد' : 'Vendor Sign up'}
                </a>
              </div>
              <div className="flex gap-3">
                <a
                  href={phoneHref}
                  className="flex-1 text-center py-2.5 rounded-lg border border-gray-200 text-brand-dark text-sm font-bold"
                >
                  {isAr ? 'اتصل بنا' : 'Call Us'}
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-bold"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
