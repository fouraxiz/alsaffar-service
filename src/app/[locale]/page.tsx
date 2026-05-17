import {setRequestLocale} from 'next-intl/server';
import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import ServicesSection from '@/components/home/ServicesSection';
import ServicePackages from '@/components/home/ServicePackages';
import DomesticWorkers from '@/components/home/DomesticWorkers';
import VisaServices from '@/components/home/VisaServices';
import ValueAddedServices from '@/components/home/ValueAddedServices';
import WhyUs from '@/components/home/WhyUs';
import TrustBadges from '@/components/home/TrustBadges';
import CTABanner from '@/components/home/CTABanner';

type Props = {params: Promise<{locale: string}>};

export default async function HomePage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Stats />
      <ServicesSection />
      <ServicePackages />
      <DomesticWorkers />
      <VisaServices />
      <ValueAddedServices />
      <WhyUs />
      <TrustBadges />
      <CTABanner />
    </>
  );
}
