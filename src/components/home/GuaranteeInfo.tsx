'use client';

import {useTranslations} from 'next-intl';
import {ShieldCheck, Scale, HeartHandshake} from 'lucide-react';

export default function GuaranteeInfo() {
  const t = useTranslations('guarantee');

  const guarantees = [
    {
      key: 'replacement',
      icon: <HeartHandshake size={32} />,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-100'
    },
    {
      key: 'legal',
      icon: <ShieldCheck size={32} />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100'
    },
    {
      key: 'support',
      icon: <Scale size={32} />,
      color: 'text-sky-500',
      bg: 'bg-sky-50',
      border: 'border-sky-100'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            {t('badge')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">
            {t('title')}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            {t('subtitle')}
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {guarantees.map((item) => (
            <div 
              key={item.key}
              className={`flex flex-col items-center text-center p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${item.bg} ${item.border}`}
            >
              <div className={`w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-3">
                {t(`${item.key}.title`)}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {t(`${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
