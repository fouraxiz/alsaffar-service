import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Cairo} from 'next/font/google';
import {routing} from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingSidebar from '@/components/layout/FloatingSidebar';
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
  return {
    title: {
      default: isAr ? 'الصفار للاستقدام' : 'Alsaffar Manpower Recruitment',
      template: isAr ? '%s | الصفار للاستقدام' : '%s | Alsaffar Manpower Recruitment',
    },
    description: isAr
      ? 'شركة الصفار للاستقدام — استقدام عمالة منزلية وسائقين وعمالة ماهرة في المملكة العربية السعودية'
      : 'Alsaffar Manpower Recruitment — Professional domestic workers, drivers, and skilled labor recruitment in Saudi Arabia',
    keywords: isAr
      ? ['استقدام', 'عمالة منزلية', 'سائق', 'الرياض', 'المملكة العربية السعودية']
      : ['recruitment', 'manpower', 'domestic worker', 'Saudi Arabia', 'Riyadh'],
    openGraph: {
      siteName: isAr ? 'الصفار للاستقدام' : 'Alsaffar Manpower Recruitment',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
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
      <div style={{fontFamily: cairo.style.fontFamily}} className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingSidebar />
      </div>
    </NextIntlClientProvider>
  );
}
