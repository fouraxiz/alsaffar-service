import {setRequestLocale} from 'next-intl/server';
import {useTranslations, useLocale} from 'next-intl';
import {Home, Car, Wrench, Briefcase, FileText, HeartHandshake, CheckCircle2, ArrowRight, ChevronRight} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type {Metadata} from 'next';
import {buildAlternates} from '@/lib/seo';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
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
    openGraph: {title, description, url: alternates.canonical},
  };
}

function ServicesContent() {
  const t = useTranslations('servicesPage');
  const locale = useLocale();

  const services = [
    {
      key: 'domestic',
      icon: <Home size={28} />,
      color: 'from-rose-600/90 to-rose-900/90',
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    },
    {
      key: 'drivers',
      icon: <Car size={28} />,
      color: 'from-sky-600/90 to-sky-900/90',
      img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    },
    {
      key: 'skilled',
      icon: <Wrench size={28} />,
      color: 'from-amber-600/90 to-amber-900/90',
      img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    },
    {
      key: 'corporate',
      icon: <Briefcase size={28} />,
      color: 'from-violet-600/90 to-violet-900/90',
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    },
    {
      key: 'visa',
      icon: <FileText size={28} />,
      color: 'from-emerald-600/90 to-emerald-900/90',
      img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    },
    {
      key: 'support',
      icon: <HeartHandshake size={28} />,
      color: 'from-orange-600/90 to-orange-900/90',
      img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    },
  ] as const;

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
    {code: 'ph', name: 'Philippines'},
    {code: 'id', name: 'Indonesia'},
    {code: 'in', name: 'India'},
    {code: 'lk', name: 'Sri Lanka'},
    {code: 'et', name: 'Ethiopia'},
    {code: 'bd', name: 'Bangladesh'},
    {code: 'np', name: 'Nepal'},
    {code: 'pk', name: 'Pakistan'},
  ];

  return (
    <>
      {/* ── Hero with background image ── */}
      <section className="relative bg-brand-dark pt-32 pb-28 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80"
          alt="Our Services"
          fill
          className="object-cover opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/80 to-brand-dark/40" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/40 text-sm mb-5 font-medium">
            <span>Alsaffar</span>
            <ChevronRight size={14} />
            <span className="text-white/80">{t('title')}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-tight max-w-2xl">
            {t('title')}
          </h1>
          <p className="text-white/70 text-xl max-w-xl leading-relaxed mb-10">
            {t('subtitle')}
          </p>

          {/* Highlight badges */}
          <div className="flex flex-wrap gap-3">
            <span className="bg-brand-orange text-white text-sm font-bold px-5 py-2 rounded-full">
              {locale === 'ar' ? 'منصة مساند' : 'Musaned Registered'}
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2 rounded-full">
              {locale === 'ar' ? '٦ فئات خدمة' : '6 Service Categories'}
            </span>
            <span className="bg-white/10 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2 rounded-full">
              {locale === 'ar' ? '١٥+ سنة خبرة' : '15+ Years Experience'}
            </span>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
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

      {/* ── Services grid ── */}
      <section className="py-24 bg-white">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {services.map((service) => (
              <div
                key={service.key}
                className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-400 border border-gray-100 hover:-translate-y-1"
              >
                {/* Image header */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.img}
                    alt={t(`${service.key}.title`)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.color}`} />

                  {/* Icon badge */}
                  <div className="absolute top-4 start-4 w-11 h-11 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center text-white">
                    {service.icon}
                  </div>

                  {/* Title on image */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="text-xl font-black text-white leading-snug">
                      {t(`${service.key}.title`)}
                    </h2>
                    <div className="text-white/80 text-sm font-semibold mt-0.5">
                      {t(`${service.key}.subtitle`)}
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 bg-white">
                  <p className="text-gray-500 leading-relaxed mb-5">
                    {t(`${service.key}.desc`)}
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {(t.raw(`${service.key}.features`) as string[]).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-1.5 bg-brand-gray text-brand-dark text-sm font-medium px-3 py-1.5 rounded-full"
                      >
                        <CheckCircle2 size={13} className="text-brand-orange flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

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

      {/* ── Source Countries ── */}
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
                <div className="w-12 h-9 relative rounded overflow-hidden shadow-sm">
                  <Image
                    src={`https://flagcdn.com/w80/${c.code}.png`}
                    alt={c.name}
                    fill
                    className="object-cover"
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

export default async function ServicesPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <ServicesContent />;
}
