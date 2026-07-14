import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { buildAlternates } from '@/lib/seo';
import PageBanner from '@/components/shared/PageBanner';
import ServiceIcon from '@/components/shared/ServiceIcon';
import { getServices } from '@/lib/getServices';
import type { DisplayService } from '@/lib/serviceAdapter';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === 'ar';
  const title = isAr ? 'خدماتنا' : 'Our Services';
  const description = isAr
    ? 'خدمات الصفار للاستقدام — عمالة منزلية، سائقون، عمالة ماهرة، توظيف مؤسسي، ومعالجة التأشيرات.'
    : 'Alsaffar recruitment services — domestic workers, drivers, skilled labor, corporate staffing, and visa processing.';
  const alternates = buildAlternates(locale, '/services');
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
  };
}

function ServicesContent({ services }: { services: DisplayService[] }) {
  const t = useTranslations('servicesPage');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const titleFor = (s: DisplayService) => {
    const fromApi = isAr ? s.title.ar : s.title.en;
    if (fromApi?.trim()) return fromApi;
    try {
      return t(`${s.pageKey}.title`);
    } catch {
      return s.serviceKey;
    }
  };

  const subtitleFor = (s: DisplayService) => {
    try {
      return t(`${s.pageKey}.subtitle`);
    } catch {
      return '';
    }
  };

  const descFor = (s: DisplayService) => {
    const fromApi = isAr ? s.description.ar : s.description.en;
    if (fromApi?.trim()) return fromApi;
    try {
      return t(`${s.pageKey}.desc`);
    } catch {
      return '';
    }
  };

  const featuresFor = (s: DisplayService): string[] => {
    try {
      const raw = t.raw(`${s.pageKey}.features`);
      return Array.isArray(raw) ? (raw as string[]) : [];
    } catch {
      return [];
    }
  };

  const steps = [
    {
      num: '01',
      title: locale === 'ar' ? 'تقديم الطلب' : 'Submit Request',
      desc: locale === 'ar' ? 'أخبرنا عن احتياجاتك من العمالة' : 'Tell us your manpower requirements',
    },
    {
      num: '02',
      title: locale === 'ar' ? 'الفرز والاختيار' : 'Screen & Select',
      desc: locale === 'ar' ? 'نفرز المرشحين المؤهلين ونختار الأفضل' : 'We shortlist the best qualified candidates',
    },
    {
      num: '03',
      title: locale === 'ar' ? 'التوثيق والتأشيرة' : 'Documentation',
      desc: locale === 'ar' ? 'نتولى جميع الأوراق والتأشيرات' : 'We handle all paperwork and visas',
    },
    {
      num: '04',
      title: locale === 'ar' ? 'الوصول والتسليم' : 'Arrival & Handover',
      desc: locale === 'ar' ? 'استلام العامل مع الدعم الكامل' : 'Worker arrives with full support',
    },
  ];

  const countries = [
    { code: 'ph', name: 'Philippines' },
    { code: 'id', name: 'Indonesia' },
    { code: 'in', name: 'India' },
    { code: 'lk', name: 'Sri Lanka' },
    { code: 'et', name: 'Ethiopia' },
    { code: 'bd', name: 'Bangladesh' },
    { code: 'np', name: 'Nepal' },
    { code: 'pk', name: 'Pakistan' },
  ];

  return (
    <>
      <div>
        <PageBanner
          title={t('title')}
          subtitle={t('subtitle')}
          badgeText={locale === 'ar' ? 'ما نقدمه' : 'What We Offer'}
          iconType="services"
        />
      </div>

      <section className="py-20 bg-brand-orange relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 start-1/4 w-64 h-64 rounded-full bg-white -translate-y-1/2" />
          <div className="absolute bottom-0 end-1/4 w-48 h-48 rounded-full bg-white translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-white/20 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              {locale === 'ar' ? 'العملية' : 'Our Process'}
            </div>
            <h2 className="text-4xl font-black text-white">
              {locale === 'ar' ? 'كيف نعمل' : 'How It Works'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-8 start-[calc(50%+2.5rem)] items-center w-[calc(100%-5rem)]">
                    <div className="flex-1 border-t-2 border-dashed border-white/40" />
                    <ArrowRight size={16} className="text-white/40 flex-shrink-0" />
                  </div>
                )}
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <span className="text-brand-orange font-black text-xl">{step.num}</span>
                </div>
                <h3 className="font-black text-white text-lg mb-2">{step.title}</h3>
                <p className="text-white/75 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/45">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              {locale === 'ar' ? 'خدماتنا' : 'What We Offer'}
            </div>
            <h2 className="text-4xl font-black text-brand-dark mb-3">
              {locale === 'ar' ? 'حلول شاملة لاحتياجاتك' : 'Complete Recruitment Solutions'}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              {locale === 'ar'
                ? 'نقدم طيفاً واسعاً من خدمات الاستقدام والتوظيف'
                : 'A full spectrum of recruitment and staffing services'}
            </p>
          </div>

          {services.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              {isAr ? 'لا توجد خدمات نشطة حالياً.' : 'No active services at the moment.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {services.map((service) => {
                const features = featuresFor(service);
                return (
                  <div
                    key={service.serviceKey}
                    className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:-translate-y-1"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={service.pageImage}
                        alt={titleFor(service)}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={!service.pageImage.includes('images.unsplash.com')}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient}`} />

                      <div className="absolute top-4 start-4 w-11 h-11 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center text-white">
                        <ServiceIcon name={service.icon} size={28} />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <h2 className="text-xl font-black text-white leading-snug">
                          {titleFor(service)}
                        </h2>
                        {subtitleFor(service) ? (
                          <div className="text-white/80 text-sm font-semibold mt-0.5">
                            {subtitleFor(service)}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="p-6 bg-white">
                      <p className="text-gray-500 leading-relaxed mb-5">{descFor(service)}</p>
                      {features.length > 0 ? (
                        <ul className="flex flex-wrap gap-2">
                          {features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-1.5 bg-brand-gray text-brand-dark text-sm font-medium px-3 py-1.5 rounded-full"
                            >
                              <CheckCircle2 size={13} className="text-brand-orange flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-3 bg-brand-orange hover:bg-brand-orange-dark text-white px-10 py-4 rounded-xl font-bold text-lg transition-colors duration-200 shadow-lg shadow-brand-orange/30"
            >
              {locale === 'ar' ? 'استفسر عن خدماتنا' : 'Enquire About Our Services'}
              <ArrowRight size={20} className={locale === 'ar' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1600&q=60"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            {locale === 'ar' ? 'دول المصدر' : 'Source Countries'}
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            {locale === 'ar' ? 'نستقدم من أفضل دول العمالة' : 'We Recruit From 8+ Countries'}
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'نستقدم العمالة المؤهلة وفق أعلى معايير الجودة والكفاءة'
              : 'Qualified workers sourced under the highest quality and ethical standards'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {countries.map((c) => (
              <div
                key={c.name}
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl px-6 py-4 transition-colors flex flex-col items-center justify-center gap-3 min-w-[120px]"
              >
                <div className="w-12 h-9 relative rounded overflow-hidden shadow-sm flex items-center justify-center bg-gray-50">
                  <Image
                    src={`https://flagcdn.com/w80/${c.code}.png`}
                    alt={c.name}
                    fill
                    sizes="3rem"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white font-semibold text-sm">{c.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { services } = await getServices();
  return <ServicesContent services={services} />;
}
