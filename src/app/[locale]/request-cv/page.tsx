import { Suspense } from 'react';
import {setRequestLocale} from 'next-intl/server';
import CVBrowser from '@/components/request-cv/CVBrowser';

type Props = {params: Promise<{locale: string}>};

export default async function RequestCVPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CVBrowser />
    </Suspense>
  );
}
