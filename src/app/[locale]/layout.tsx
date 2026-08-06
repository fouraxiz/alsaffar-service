import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo } from 'next/font/google';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSidebar from '@/components/layout/FloatingSidebar';
import MotionBanner from '@/components/home/MotionBanner';
import DirectionProvider from '@/components/DirectionProvider';
import LiveChatBar from '@/components/shared/LiveChatBar';
import JsonLd from '@/components/seo/JsonLd';
import SilhouetteBackdrop from '@/components/home/SilhouetteBackdrop';
import { SiteProvider } from '@/components/site/SiteProvider';
import { PortalUrlProvider } from '@/components/site/PortalUrlProvider';
import { PortalSessionProvider } from '@/components/site/PortalSessionProvider';
import { getSite } from '@/lib/getSite';
import { serverEnv } from '@/lib/env';
import {
  isLocalHostname,
  portalDefaults,
  resolvePortalUrlFromServer,
} from '@/lib/portalUrl';
import { SITE_URL, buildAlternates, BRAND_KEYWORDS_EN, BRAND_KEYWORDS_AR } from '@/lib/seo';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const { site } = await getSite();
  const siteName =
    (isAr ? site.name.ar : site.name.en) ||
    (isAr ? 'الصفار للاستقدام' : 'Alsaffar Manpower Recruitment');
  const description =
    (isAr ? site.tagline.ar : site.tagline.en) ||
    (isAr
      ? 'شركة الصفار للاستقدام — استقدام عمالة منزلية وسائقين وعمالة ماهرة في المملكة العربية السعودية'
      : 'Alsaffar Manpower Recruitment — Professional domestic workers, drivers, and skilled labor recruitment in Saudi Arabia');
  const ogImage = site.logo_url || '/alsaffar.png';
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: isAr ? `%s | ${site.name.ar || siteName}` : `%s | ${site.name.en || siteName}`,
    },
    description,
    keywords: isAr ? BRAND_KEYWORDS_AR : BRAND_KEYWORDS_EN,
    alternates: buildAlternates(locale, ''),
    openGraph: {
      type: 'website',
      siteName,
      title: siteName,
      description,
      url: `${SITE_URL}/${locale}`,
      locale: isAr ? 'ar_SA' : 'en_US',
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: [ogImage],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const { site } = await getSite();

  const hostHeader = (await headers()).get('host') ?? '';
  const hostname = hostHeader.split(':')[0] ?? '';
  const portalUrl = isLocalHostname(hostname)
    ? portalDefaults.local
    : resolvePortalUrlFromServer(serverEnv.erp.baseUrl);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SiteProvider initialSite={site}>
        <PortalUrlProvider initialPortalUrl={portalUrl}>
          <PortalSessionProvider>
          <JsonLd locale={locale} />
          <DirectionProvider />
          <div style={{ fontFamily: cairo.style.fontFamily }} className="flex flex-col min-h-screen relative pb-[70px]">
            <SilhouetteBackdrop className="fixed inset-0 -z-10" />
            <Header />
            <MotionBanner />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingSidebar />
            <LiveChatBar />
          </div>
          </PortalSessionProvider>
        </PortalUrlProvider>
      </SiteProvider>
    </NextIntlClientProvider>
  );
}
