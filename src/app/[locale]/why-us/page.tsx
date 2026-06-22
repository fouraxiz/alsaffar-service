import {setRequestLocale} from 'next-intl/server';
import WhyUs from '@/components/home/WhyUs';
import type {Metadata} from 'next';
import {buildAlternates} from '@/lib/seo';

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

  return (
    <div className="pt-24 min-h-screen bg-white">
      <WhyUs />
    </div>
  );
}
