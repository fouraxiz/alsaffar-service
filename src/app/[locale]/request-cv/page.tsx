import { Suspense } from 'react';
import {setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import CVBrowser from '@/components/request-cv/CVBrowser';
import {buildAlternates} from '@/lib/seo';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale === 'ar';
  const title = isAr ? 'تصفح العمالة المتاحة' : 'Browse Available Workers';
  const description = isAr
    ? 'تصفح السير الذاتية للعمالة المتاحة من الصفار للاستقدام واطلب المرشح المناسب لمنزلك أو عملك.'
    : 'Browse available worker CVs from Alsaffar and request the right candidate for your home or business.';
  const alternates = buildAlternates(locale, '/request-cv');
  return {
    title,
    description,
    alternates,
    openGraph: {title, description, url: alternates.canonical},
  };
}

export default async function RequestCVPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={null}>
      <CVBrowser />
    </Suspense>
  );
}
