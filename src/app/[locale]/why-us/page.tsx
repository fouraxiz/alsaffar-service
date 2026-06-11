import {setRequestLocale} from 'next-intl/server';
import WhyUs from '@/components/home/WhyUs';
import type {Metadata} from 'next';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: locale === 'ar' ? 'لماذا نحن' : 'Why Us',
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
