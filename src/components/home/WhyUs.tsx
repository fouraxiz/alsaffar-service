import {useTranslations, useLocale} from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import {Zap, ShieldCheck, Scale, Headphones, RefreshCw, BadgeDollarSign, CheckCircle} from 'lucide-react';

export default function WhyUs() {
  const t = useTranslations('whyUs');
  const locale = useLocale();

  const reasons = [
    {key: 'fast', icon: <Zap size={20} />, color: 'text-amber-500 bg-amber-50'},
    {key: 'vetted', icon: <ShieldCheck size={20} />, color: 'text-emerald-500 bg-emerald-50'},
    {key: 'legal', icon: <Scale size={20} />, color: 'text-sky-500 bg-sky-50'},
    {key: 'support', icon: <Headphones size={20} />, color: 'text-violet-500 bg-violet-50'},
    {key: 'guarantee', icon: <RefreshCw size={20} />, color: 'text-rose-500 bg-rose-50'},
    {key: 'transparent', icon: <BadgeDollarSign size={20} />, color: 'text-brand-orange bg-brand-light'},
  ] as const;

  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* LEFT — image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700&q=85&auto=format&fit=crop"
                alt="Professional team meeting"
                width={600}
                height={520}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -end-5 bg-brand-orange rounded-2xl p-5 shadow-xl text-white">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle size={18} />
                <span className="font-bold text-sm">
                  {locale === 'ar' ? 'مرخص رسمياً' : 'Officially Licensed'}
                </span>
              </div>
              <div className="text-white/80 text-xs">
                {locale === 'ar' ? 'وزارة الموارد البشرية' : 'Ministry of Human Resources'}
              </div>
            </div>
            {/* Decorative ring */}
            <div className="absolute -top-4 -start-4 w-24 h-24 rounded-full border-4 border-brand-orange/20 z-0" />
          </div>

          {/* RIGHT — content */}
          <div className="order-1 lg:order-2">
            <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              {t('title')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">{t('title')}</h2>
            <p className="text-gray-500 mb-8">{t('subtitle')}</p>

            <div className="space-y-4">
              {reasons.map((reason) => (
                <div
                  key={reason.key}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-brand-gray transition-colors duration-200"
                >
                  <div className={`w-10 h-10 ${reason.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-dark mb-0.5">{t(`${reason.key}.title`)}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{t(`${reason.key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-7 py-3.5 rounded-xl font-bold transition-all duration-200 hover:scale-105"
              >
                {locale === 'ar' ? 'تواصل معنا الآن' : 'Contact Us Now'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
