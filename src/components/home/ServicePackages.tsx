'use client';

import {useState} from 'react';
import {useTranslations, useLocale} from 'next-intl';
import {X, Phone, CheckCircle, Star} from 'lucide-react';

const WhatsAppIcon = ({size = 18}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

type PackageKey = 'maid2yr' | 'maid1yr' | 'driver' | 'corporate';

export default function ServicePackages() {
  const t = useTranslations('packages');
  const locale = useLocale();
  const [selected, setSelected] = useState<PackageKey | null>(null);

  const packageKeys: PackageKey[] = ['maid2yr', 'maid1yr', 'driver', 'corporate'];

  const packageColors: Record<PackageKey, string> = {
    maid2yr: 'from-rose-500 to-rose-700',
    maid1yr: 'from-sky-500 to-sky-700',
    driver: 'from-amber-500 to-amber-700',
    corporate: 'from-violet-500 to-violet-700',
  };

  const packageIcons: Record<PackageKey, string> = {
    maid2yr: '🏠',
    maid1yr: '🏡',
    driver: '🚗',
    corporate: '🏢',
  };

  // Hardcoded badge keys to avoid null/missing message issues in JSON
  const packageBadges: Record<PackageKey, 'popular' | 'bestValue' | null> = {
    maid2yr: 'popular',
    maid1yr: 'bestValue',
    driver: null,
    corporate: null,
  };

  const selectedPkg = selected
    ? {
        key: selected,
        title: t(`items.${selected}.title`),
        subtitle: t(`items.${selected}.subtitle`),
        desc: t(`items.${selected}.desc`),
        features: t.raw(`items.${selected}.features`) as string[],
        whatsappMsg: t(`items.${selected}.whatsappMsg`),
        badgeKey: packageBadges[selected],
        color: packageColors[selected],
      }
    : null;

  return (
    <section className="py-20 bg-brand-gray">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            {t('title')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">{t('title')}</h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Package cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {packageKeys.map((key) => {
            const badgeKey = packageBadges[key];
            const features = t.raw(`items.${key}.features`) as string[];
            return (
              <div
                key={key}
                className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelected(key)}
              >
                {/* Color header */}
                <div className={`bg-gradient-to-br ${packageColors[key]} p-6 text-white`}>
                  <div className="text-3xl mb-3">{packageIcons[key]}</div>
                  {badgeKey && (
                    <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                      <Star size={10} fill="currentColor" />
                      {t(badgeKey)}
                    </div>
                  )}
                  <h3 className="font-black text-base leading-snug">{t(`items.${key}.title`)}</h3>
                  <p className="text-white/80 text-xs mt-1">{t(`items.${key}.subtitle`)}</p>
                </div>

                {/* Body */}
                <div className="p-5">
                  <ul className="space-y-2 mb-5">
                    {features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckCircle size={14} className="text-brand-orange flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                    {features.length > 3 && (
                      <li className="text-brand-orange text-xs font-semibold ps-5">
                        +{features.length - 3} {locale === 'ar' ? 'مزايا أخرى' : 'more features'}
                      </li>
                    )}
                  </ul>

                  <button
                    className="w-full py-2.5 rounded-xl bg-brand-dark hover:bg-brand-olive text-white text-sm font-bold transition-colors group-hover:bg-brand-orange"
                  >
                    {t('viewDetails')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && selectedPkg && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className={`bg-gradient-to-br ${selectedPkg.color} p-6 text-white relative`}>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 end-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
              <div className="text-3xl mb-3">{packageIcons[selected]}</div>
              <h3 className="font-black text-xl leading-snug">{selectedPkg.title}</h3>
              <p className="text-white/80 text-sm mt-1 font-semibold">{selectedPkg.subtitle}</p>
            </div>

            {/* Modal body */}
            <div className="p-6">
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">{selectedPkg.desc}</p>

              <div className="font-bold text-brand-dark text-sm mb-3">{t('includesLabel')}</div>
              <ul className="space-y-2.5 mb-6">
                {selectedPkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                    <CheckCircle size={16} className="text-brand-orange flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Action buttons — matches the screenshot exactly */}
              <div className="flex gap-3">
                <a
                  href="tel:+966547123180"
                  className="flex-1 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  <Phone size={16} />
                  {t('requestCallback')}
                </a>
                <a
                  href={`https://wa.me/966547123180?text=${encodeURIComponent(selectedPkg.whatsappMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 rounded-xl text-sm transition-colors"
                >
                  <WhatsAppIcon size={16} />
                  {t('whatsappUs')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
