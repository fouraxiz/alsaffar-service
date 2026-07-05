import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import WhyUs from '@/components/home/WhyUs';
import {buildAlternates} from '@/lib/seo';
import PageBanner from '@/components/shared/PageBanner';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale === 'ar';
  const title = isAr ? 'لماذا نحن' : 'Why Us';
  const description = isAr
    ? 'لماذا تختار الصفار للاستقدام — عمالة مدققة، ضمان الاستبدال، وخبرة تزيد عن 15 عاماً.'
    : 'Why choose Alsaffar — pre-vetted workers, replacement guarantee, and 15+ years of experience.';
  const alternates = buildAlternates(locale, '/why-us');
  return {
    title,
    description,
    alternates,
    openGraph: {title, description, url: alternates.canonical},
  };
}

export default async function WhyUsPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const title = locale === 'ar' ? 'لماذا نحن' : 'Why Us';
  const subtitle = locale === 'ar' 
    ? 'اكتشف ما يميزنا عن غيرنا في تقديم خدمات الاستقدام بخبرة وموثوقية عالية' 
    : 'Discover what sets us apart in providing recruitment services with high expertise and reliability';
  const badgeText = locale === 'ar' ? 'ميزتنا' : 'Our Advantage';

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageBanner
        title={title}
        subtitle={subtitle}
        badgeText={badgeText}
        iconType="why-us"
      />
      <div className="mt-0">
        <WhyUs />
      </div>
    </div>
  );
}
