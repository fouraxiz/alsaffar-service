'use client';

import {useLocale} from 'next-intl';
import {useState} from 'react';

type Nationality = {
  code: string;
  flag: string;
  nameAr: string;
  nameEn: string;
  category: 'domestic' | 'driver' | 'skilled';
  priceRange: string;
};

const nationalities: Nationality[] = [
  {code: 'PH', flag: '🇵🇭', nameAr: 'فلبينية', nameEn: 'Filipino', category: 'domestic', priceRange: '8,000–12,000 ريال'},
  {code: 'ID', flag: '🇮🇩', nameAr: 'إندونيسية', nameEn: 'Indonesian', category: 'domestic', priceRange: '7,000–10,000 ريال'},
  {code: 'LK', flag: '🇱🇰', nameAr: 'سريلانكية', nameEn: 'Sri Lankan', category: 'domestic', priceRange: '6,000–9,000 ريال'},
  {code: 'ET', flag: '🇪🇹', nameAr: 'إثيوبية', nameEn: 'Ethiopian', category: 'domestic', priceRange: '5,000–8,000 ريال'},
  {code: 'IN', flag: '🇮🇳', nameAr: 'هندية', nameEn: 'Indian', category: 'driver', priceRange: '5,000–9,000 ريال'},
  {code: 'PK', flag: '🇵🇰', nameAr: 'باكستانية', nameEn: 'Pakistani', category: 'driver', priceRange: '5,000–8,000 ريال'},
  {code: 'BD', flag: '🇧🇩', nameAr: 'بنغلاديشية', nameEn: 'Bangladeshi', category: 'skilled', priceRange: '4,500–7,500 ريال'},
  {code: 'NP', flag: '🇳🇵', nameAr: 'نيبالية', nameEn: 'Nepali', category: 'skilled', priceRange: '4,000–7,000 ريال'},
  {code: 'UG', flag: '🇺🇬', nameAr: 'أوغندية', nameEn: 'Ugandan', category: 'domestic', priceRange: '4,500–7,000 ريال'},
  {code: 'KE', flag: '🇰🇪', nameAr: 'كينية', nameEn: 'Kenyan', category: 'domestic', priceRange: '5,000–8,000 ريال'},
  {code: 'GH', flag: '🇬🇭', nameAr: 'غانية', nameEn: 'Ghanaian', category: 'domestic', priceRange: '5,000–8,000 ريال'},
  {code: 'TZ', flag: '🇹🇿', nameAr: 'تنزانية', nameEn: 'Tanzanian', category: 'domestic', priceRange: '4,500–7,000 ريال'},
];

const categoryLabels = {
  all: {ar: 'الكل', en: 'All'},
  domestic: {ar: 'عمالة منزلية', en: 'Domestic Workers'},
  driver: {ar: 'سائقون', en: 'Drivers'},
  skilled: {ar: 'عمالة ماهرة', en: 'Skilled Workers'},
};

const categoryColors: Record<string, string> = {
  domestic: 'bg-rose-100 text-rose-700 border-rose-200',
  driver: 'bg-sky-100 text-sky-700 border-sky-200',
  skilled: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function NationalityFlags() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [activeFilter, setActiveFilter] = useState<'all' | 'domestic' | 'driver' | 'skilled'>('all');
  const [hovered, setHovered] = useState<string | null>(null);

  const filtered = activeFilter === 'all' ? nationalities : nationalities.filter(n => n.category === activeFilter);

  return (
    <section className="py-16 bg-gradient-to-br from-brand-light to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            {isAr ? 'جنسيات متاحة' : 'Available Nationalities'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-3">
            {isAr ? 'اختر الجنسية المناسبة لك' : 'Choose Your Preferred Nationality'}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            {isAr
              ? 'نوفر عمالة من أفضل الجنسيات المعتمدة بأسعار تنافسية وإجراءات سريعة'
              : 'We provide workers from top certified nationalities at competitive prices with fast processing'}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" dir={isAr ? 'rtl' : 'ltr'}>
          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as typeof activeFilter)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
                activeFilter === key
                  ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
              }`}
            >
              {isAr ? categoryLabels[key].ar : categoryLabels[key].en}
            </button>
          ))}
        </div>

        {/* Flags grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {filtered.map((nat) => (
            <div
              key={nat.code}
              onMouseEnter={() => setHovered(nat.code)}
              onMouseLeave={() => setHovered(null)}
              className="relative group cursor-pointer"
            >
              <div className={`flex flex-col items-center gap-2 bg-white border-2 rounded-2xl p-4 transition-all duration-200 ${
                hovered === nat.code
                  ? 'border-brand-orange shadow-xl shadow-orange-100 -translate-y-2 scale-105'
                  : 'border-gray-100 hover:border-orange-200'
              }`}>
                {/* Flag emoji */}
                <span className="text-4xl leading-none select-none">{nat.flag}</span>
                <div className="text-center">
                  <div className="font-black text-brand-dark text-sm">
                    {isAr ? nat.nameAr : nat.nameEn}
                  </div>
                  <div className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[nat.category]}`}>
                    {isAr ? categoryLabels[nat.category].ar : categoryLabels[nat.category].en}
                  </div>
                </div>

                {/* Price tooltip on hover */}
                {hovered === nat.code && (
                  <div className="text-[11px] font-semibold text-brand-orange text-center leading-tight">
                    {nat.priceRange}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <div className="text-center mt-10">
          <a
            href="https://wa.me/966547123180"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 hover:scale-105 shadow-lg shadow-green-200"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            {isAr ? 'استفسر عن جنسية محددة' : 'Enquire About a Nationality'}
          </a>
        </div>
      </div>
    </section>
  );
}
