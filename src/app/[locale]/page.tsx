import {setRequestLocale} from 'next-intl/server';
import Hero from '@/components/home/Hero';
import TrustBadgesTop from '@/components/home/TrustBadgesTop';
import Stats from '@/components/home/Stats';
import NationalityFlags from '@/components/home/NationalityFlags';
import CTABanner from '@/components/home/CTABanner';
import WhatsAppPopup from '@/components/shared/WhatsAppPopup';
import GuaranteeInfo from '@/components/home/GuaranteeInfo';

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <WhatsAppPopup />
      <Hero />
      <TrustBadgesTop />
      <Stats />
      <GuaranteeInfo />
      <NationalityFlags />
      <CTABanner />
    </>
  );
}
