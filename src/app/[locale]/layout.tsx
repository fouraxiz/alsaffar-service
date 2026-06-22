import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Cairo} from 'next/font/google';
import {routing} from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSidebar from '@/components/layout/FloatingSidebar';
import DirectionProvider from '@/components/DirectionProvider';
import LiveChatBar from '@/components/shared/LiveChatBar';
import JsonLd from '@/components/seo/JsonLd';
import {SITE_URL, buildAlternates, BRAND_KEYWORDS_EN, BRAND_KEYWORDS_AR} from '@/lib/seo';
import type {Metadata} from 'next';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale === 'ar';
  const siteName = isAr ? 'الصفار للاستقدام' : 'Alsaffar Manpower Recruitment';
  const description = isAr
    ? 'شركة الصفار للاستقدام — استقدام عمالة منزلية وسائقين وعمالة ماهرة في المملكة العربية السعودية'
    : 'Alsaffar Manpower Recruitment — Professional domestic workers, drivers, and skilled labor recruitment in Saudi Arabia';
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: isAr ? '%s | الصفار للاستقدام' : '%s | Alsaffar Manpower Recruitment',
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
      images: [{url: '/alsaffar.png', width: 1200, height: 630, alt: siteName}],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
      images: ['/alsaffar.png'],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Props) {
  const {locale} = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <JsonLd locale={locale} />
      <DirectionProvider />
      <div style={{fontFamily: cairo.style.fontFamily}} className="flex flex-col min-h-screen relative pb-[70px]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingSidebar />
        <LiveChatBar />
      </div>
    </NextIntlClientProvider>
  );
}
