import {setRequestLocale} from 'next-intl/server';
import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import NationalityFlags from '@/components/home/NationalityFlags';
import TrustBadgesTop from '@/components/home/TrustBadgesTop';
import Stats from '@/components/home/Stats';
import CTABanner from '@/components/home/CTABanner';
import WhatsAppPopup from '@/components/shared/WhatsAppPopup';
import GuaranteeInfo from '@/components/home/GuaranteeInfo';
import { getServices } from '@/lib/getServices';

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  const { services } = await getServices();

  return (
    <>
      <WhatsAppPopup />
      <Hero />
      <ServicesSection initialServices={services} />
      <NationalityFlags />
      <TrustBadgesTop />
      <Stats />
      <GuaranteeInfo />
      <CTABanner />
    </>
  );
}
