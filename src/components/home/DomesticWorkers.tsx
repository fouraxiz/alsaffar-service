import {useTranslations} from 'next-intl';
import Image from 'next/image';

const WhatsAppIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const workerImages: Record<string, string> = {
  housemaid: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&auto=format&fit=crop',
  cook: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80&auto=format&fit=crop',
  nanny: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=300&q=80&auto=format&fit=crop',
  elderly: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=300&q=80&auto=format&fit=crop',
  cleaner: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&q=80&auto=format&fit=crop',
  laundry: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=300&q=80&auto=format&fit=crop',
};

const workerMsgs: Record<string, string> = {
  housemaid: 'Hello! I need a Housemaid. Please provide details.',
  cook: 'Hello! I need a Cook. Please provide details.',
  nanny: 'Hello! I need a Nanny/Babysitter. Please provide details.',
  elderly: 'Hello! I need an Elderly Care Worker. Please provide details.',
  cleaner: 'Hello! I need a Home Cleaner. Please provide details.',
  laundry: 'Hello! I need a Laundry/Ironing specialist. Please provide details.',
};

export default function DomesticWorkers() {
  const t = useTranslations('domesticWorkers');
  const keys = ['housemaid', 'cook', 'nanny', 'elderly', 'cleaner', 'laundry'] as const;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="inline-block bg-rose-100 text-rose-600 text-sm font-bold px-4 py-1.5 rounded-full mb-3">
              {t('title')}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-dark">{t('title')}</h2>
            <p className="text-gray-500 mt-2 max-w-lg">{t('subtitle')}</p>
          </div>
          <a
            href="https://wa.me/966920021201?text=Hello! I need a maid service. Please provide details."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors flex-shrink-0"
          >
            <WhatsAppIcon />
            {t('whatsappLabel')}
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {keys.map((key) => (
            <div
              key={key}
              className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:border-rose-100 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={workerImages[key]}
                  alt={t(`items.${key}.title`)}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-brand-dark text-sm mb-0.5">{t(`items.${key}.title`)}</h3>
                <p className="text-gray-500 text-xs leading-relaxed truncate">{t(`items.${key}.desc`)}</p>
              </div>

              {/* WhatsApp button */}
              <a
                href={`https://wa.me/966920021201?text=${encodeURIComponent(workerMsgs[key])}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-9 h-9 bg-[#25D366] hover:bg-[#1ebe5d] rounded-lg flex items-center justify-center text-white transition-colors"
                title={t('whatsappLabel')}
              >
                <WhatsAppIcon />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
