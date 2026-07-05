import {useTranslations, useLocale} from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import {ArrowRight} from 'lucide-react';
import {Home, Car, Wrench, Briefcase, FileText, HeartHandshake} from 'lucide-react';
import SilhouetteBackdrop from './SilhouetteBackdrop';

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function ServicesSection() {
  const t = useTranslations('services');
  const locale = useLocale();

  const services = [
    {
      key: 'domestic',
      icon: <Home size={22} />,
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80&auto=format&fit=crop',
      bg: 'bg-rose-500',
      waMsg: 'Hello! I am interested in Domestic Worker recruitment services.',
    },
    {
      key: 'drivers',
      icon: <Car size={22} />,
      img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80&auto=format&fit=crop',
      bg: 'bg-sky-500',
      waMsg: 'Hello! I am interested in Driver recruitment services.',
    },
    {
      key: 'skilled',
      icon: <Wrench size={22} />,
      img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80&auto=format&fit=crop',
      bg: 'bg-amber-500',
      waMsg: 'Hello! I am interested in Skilled Worker recruitment.',
    },
    {
      key: 'corporate',
      icon: <Briefcase size={22} />,
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80&auto=format&fit=crop',
      bg: 'bg-violet-500',
      waMsg: 'Hello! I am interested in Corporate Staffing services.',
    },
    {
      key: 'visa',
      icon: <FileText size={22} />,
      img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80&auto=format&fit=crop',
      bg: 'bg-emerald-500',
      waMsg: 'Hello! I need help with Visa Processing services.',
    },
    {
      key: 'followUp',
      icon: <HeartHandshake size={22} />,
      img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80&auto=format&fit=crop',
      bg: 'bg-brand-orange',
      waMsg: 'Hello! I need After-Placement Support services.',
    },
  ] as const;

  return (
    <section className="relative py-20 bg-white/70 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            {t('title')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">{t('title')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.key}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-transparent transition-all duration-300"
            >
              {/* Card image */}
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={service.img}
                  alt={t(`${service.key}.title`)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Icon badge */}
                <div className={`absolute bottom-3 start-3 w-10 h-10 ${service.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                  {service.icon}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-brand-dark text-lg mb-1.5 group-hover:text-brand-orange transition-colors">
                  {t(`${service.key}.title`)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{t(`${service.key}.desc`)}</p>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${locale}/services`}
                    className="flex-1 text-center py-2 rounded-lg border border-gray-200 text-brand-dark text-xs font-semibold hover:border-brand-orange hover:text-brand-orange transition-colors"
                  >
                    {t('learnMore')}
                  </Link>
                  <a
                    href={`https://wa.me/966920021201?text=${encodeURIComponent(service.waMsg)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <WhatsAppIcon />
                    {t('whatsapp')}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-olive text-white px-8 py-3.5 rounded-xl font-bold transition-colors duration-200"
          >
            {locale === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
