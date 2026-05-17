import {useTranslations} from 'next-intl';
import {UserCog, Stamp, Stethoscope, PlaneTakeoff, GraduationCap, Languages} from 'lucide-react';

export default function ValueAddedServices() {
  const t = useTranslations('valueAdded');

  const items = [
    {key: 'pro', icon: <UserCog size={24} />, color: 'text-brand-orange bg-brand-orange/10'},
    {key: 'mofa', icon: <Stamp size={24} />, color: 'text-violet-600 bg-violet-50'},
    {key: 'medical', icon: <Stethoscope size={24} />, color: 'text-emerald-600 bg-emerald-50'},
    {key: 'airport', icon: <PlaneTakeoff size={24} />, color: 'text-sky-600 bg-sky-50'},
    {key: 'training', icon: <GraduationCap size={24} />, color: 'text-amber-600 bg-amber-50'},
    {key: 'contract', icon: <Languages size={24} />, color: 'text-rose-600 bg-rose-50'},
  ] as const;

  return (
    <section className="py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            {t('title')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">{t('title')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.key}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-start gap-4"
            >
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-brand-dark mb-1">{t(`items.${item.key}.title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(`items.${item.key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
