import {useTranslations} from 'next-intl';
import {CheckCircle} from 'lucide-react';

export default function TrustBadges() {
  const t = useTranslations('trust');

  const badges = [
    {
      name: t('musaned'),
      desc: 'منصة مساند',
      icon: 'مساند',
      color: 'from-teal-600 to-teal-700',
    },
    {
      name: t('mol'),
      desc: 'وزارة الموارد البشرية والتنمية الاجتماعية',
      icon: 'MOL',
      color: 'from-brand-olive to-brand-dark',
    },
    {
      name: t('chamber'),
      desc: 'Chamber of Commerce — غرفة التجارة',
      icon: 'CoC',
      color: 'from-blue-700 to-blue-900',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            {t('title')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">{t('title')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {badges.map((badge) => (
            <div
              key={badge.name}
              className="flex flex-col items-center gap-4 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 w-64"
            >
              <div
                className={`w-20 h-20 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <span className="text-white font-black text-lg">{badge.icon}</span>
              </div>
              <div className="text-center">
                <div className="font-bold text-brand-dark text-base mb-1">{badge.name}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{badge.desc}</div>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                <CheckCircle size={14} />
                <span>Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
