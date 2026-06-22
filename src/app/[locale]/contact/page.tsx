import {setRequestLocale} from 'next-intl/server';
import type {Metadata} from 'next';
import {buildAlternates} from '@/lib/seo';
import ContactPageClient from './ContactPageClient';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale === 'ar';
  const title = isAr ? 'تواصل معنا' : 'Contact Us';
  const description = isAr
    ? 'تواصل مع الصفار للاستقدام — اتصل بنا أو راسلنا عبر واتساب أو البريد الإلكتروني support@alsaffar.pro.'
    : 'Contact Alsaffar Manpower Recruitment — call, WhatsApp, or email support@alsaffar.pro.';
  const alternates = buildAlternates(locale, '/contact');
  return {
    title,
    description,
    alternates,
    openGraph: {title, description, url: alternates.canonical},
  };
}

export default async function ContactPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <ContactPageClient />;
}
