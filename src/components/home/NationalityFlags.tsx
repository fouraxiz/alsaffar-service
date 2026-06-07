'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import Image from 'next/image';
import { X, Phone } from 'lucide-react';

type Nationality = {
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'domestic' | 'driver' | 'skilled';
  priceRange: string;
};

const nationalities: Nationality[] = [
  { code: 'ph', nameAr: 'فلبينية', nameEn: 'Filipino', category: 'domestic', priceRange: '8,000–12,000 ريال' },
  { code: 'id', nameAr: 'إندونيسية', nameEn: 'Indonesian', category: 'domestic', priceRange: '7,000–10,000 ريال' },
  { code: 'lk', nameAr: 'سريلانكية', nameEn: 'Sri Lankan', category: 'domestic', priceRange: '6,000–9,000 ريال' },
  { code: 'et', nameAr: 'إثيوبية', nameEn: 'Ethiopian', category: 'domestic', priceRange: '5,000–8,000 ريال' },
  { code: 'in', nameAr: 'هندية', nameEn: 'Indian', category: 'driver', priceRange: '5,000–9,000 ريال' },
  { code: 'pk', nameAr: 'باكستانية', nameEn: 'Pakistani', category: 'driver', priceRange: '5,000–8,000 ريال' },
  { code: 'bd', nameAr: 'بنغلاديشية', nameEn: 'Bangladeshi', category: 'skilled', priceRange: '4,500–7,500 ريال' },
  { code: 'np', nameAr: 'نيبالية', nameEn: 'Nepali', category: 'skilled', priceRange: '4,000–7,000 ريال' },
  { code: 'ug', nameAr: 'أوغندية', nameEn: 'Ugandan', category: 'domestic', priceRange: '4,500–7,000 ريال' },
  { code: 'ke', nameAr: 'كينية', nameEn: 'Kenyan', category: 'domestic', priceRange: '5,000–8,000 ريال' },
  { code: 'gh', nameAr: 'غانية', nameEn: 'Ghanaian', category: 'domestic', priceRange: '5,000–8,000 ريال' },
  { code: 'tz', nameAr: 'تنزانية', nameEn: 'Tanzanian', category: 'domestic', priceRange: '4,500–7,000 ريال' },
];

const categoryLabels = {
  all: { ar: 'الكل', en: 'All' },
  domestic: { ar: 'عمالة منزلية', en: 'Domestic Workers' },
  driver: { ar: 'سائقون', en: 'Drivers' },
  skilled: { ar: 'عمالة ماهرة', en: 'Skilled Workers' },
};

const categoryColors: Record<string, string> = {
  domestic: 'bg-rose-100 text-rose-700 border-rose-200',
  driver: 'bg-sky-100 text-sky-700 border-sky-200',
  skilled: 'bg-amber-100 text-amber-700 border-amber-200',
};

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function NationalityFlags() {
  const locale = useLocale();
  const t = useTranslations('nationalityModal');
  const tForm = useTranslations('contactPage.form');
  const isAr = locale === 'ar';

  const [activeFilter, setActiveFilter] = useState<'all' | 'domestic' | 'driver' | 'skilled'>('all');
  const [hovered, setHovered] = useState<string | null>(null);

  const [selectedNationality, setSelectedNationality] = useState<Nationality | null>(null);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const filtered = activeFilter === 'all' ? nationalities : nationalities.filter(n => n.category === activeFilter);

  // When clicking the main CTA without selecting a specific nationality
  const handleGeneralRequest = () => {
    const msg = isAr
      ? 'مرحباً، أود الاستفسار عن السير الذاتية المتاحة للعمالة.'
      : 'Hello, I would like to inquire about available CVs for workers.';
    window.open(`https://wa.me/966547123180?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCloseModal = () => {
    setSelectedNationality(null);
    setTimeout(() => setFormState('idle'), 300); // Reset form state after animation
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate API call for form submission
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-brand-light to-white relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-3">
            {isAr ? 'جنسيات متاحة' : 'Available Nationalities'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-dark mb-4">
            {isAr ? 'اختر الجنسية المناسبة لك' : 'Choose Your Preferred Nationality'}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base mb-6">
            {isAr
              ? 'نوفر عمالة من أفضل الجنسيات المعتمدة بأسعار تنافسية وإجراءات سريعة. تصفح واطلب السير الذاتية.'
              : 'We provide workers from top certified nationalities at competitive prices. Browse and request CVs.'}
          </p>

          <button
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105 shadow-md shadow-orange-200"
          >
            {t('requestCVs')}
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" dir={isAr ? 'rtl' : 'ltr'}>
          {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as typeof activeFilter)}
              className={`px-5 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${activeFilter === key
                  ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-orange-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                }`}
            >
              {isAr ? categoryLabels[key].ar : categoryLabels[key].en}
            </button>
          ))}
        </div>

        {/* Flags grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((nat) => (
            <div
              key={nat.code}
              onMouseEnter={() => setHovered(nat.code)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelectedNationality(nat)}
              className="relative group cursor-pointer"
            >
              <div className={`flex flex-col items-center gap-3 bg-white border-2 rounded-2xl p-5 transition-all duration-200 ${hovered === nat.code
                  ? 'border-brand-orange shadow-xl shadow-orange-100 -translate-y-1.5'
                  : 'border-gray-100 hover:border-orange-200'
                }`}>
                {/* Flag Image from CDN */}
                <div className="w-12 h-9 relative rounded overflow-hidden shadow-sm">
                  <Image
                    src={`https://flagcdn.com/w80/${nat.code}.png`}
                    alt={nat.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center w-full">
                  <div className="font-black text-brand-dark text-[15px] mb-1">
                    {isAr ? nat.nameAr : nat.nameEn}
                  </div>
                  <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[nat.category]}`}>
                    {isAr ? categoryLabels[nat.category].ar : categoryLabels[nat.category].en}
                  </div>
                </div>

                {/* Price hint on hover (desktop) or always visible small text */}
                <div className={`text-[11px] font-semibold text-brand-orange text-center leading-tight transition-opacity duration-200 ${hovered === nat.code ? 'opacity-100' : 'opacity-0'}`}>
                  {nat.priceRange}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedNationality && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-auto">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseModal}
          />

          {/* Modal Card */}
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            dir={isAr ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="bg-gray-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 relative rounded overflow-hidden shadow-sm">
                  <Image
                    src={`https://flagcdn.com/w80/${selectedNationality.code}.png`}
                    alt={selectedNationality.nameEn}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-black text-lg text-brand-dark leading-tight">
                    {t('title')}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    {t('subtitle')} {isAr ? selectedNationality.nameAr : selectedNationality.nameEn}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition-colors"
                aria-label={t('close')}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">

              <div className="mb-6 flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    {t('workerTypes')}
                  </div>
                  <div className="font-semibold text-brand-dark text-sm">
                    {t(selectedNationality.category as any)}
                  </div>
                </div>

                <div className="text-end border-s border-gray-200 ps-4">
                  <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                    {t('priceRange')}
                  </div>
                  <div className="font-bold text-brand-orange text-sm">
                    {selectedNationality.priceRange}
                  </div>
                </div>
              </div>

              {/* Recruitment Form */}
              {formState === 'success' ? (
                <div className="bg-green-50 text-green-700 p-5 rounded-xl border border-green-200 text-center font-bold mb-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {tForm('success')}
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3 mb-5">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={tForm('namePlaceholder')}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder={tForm('phonePlaceholder')}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition-colors text-sm"
                      dir="ltr"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className={`w-full text-white py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${formState === 'submitting' ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-orange hover:bg-brand-orange-dark shadow-md shadow-orange-200 hover:shadow-lg'}`}
                  >
                    {formState === 'submitting' ? '...' : t('requestCVs')}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{isAr ? 'أو عبر واتساب' : 'OR VIA WHATSAPP'}</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/966547123180?text=${encodeURIComponent(
                    isAr
                      ? `مرحباً، أود طلب السير الذاتية المتاحة للعمالة من الجنسية ${selectedNationality.nameAr} (${categoryLabels[selectedNationality.category].ar})`
                      : `Hello, I would like to request available CVs for ${selectedNationality.nameEn} workers (${categoryLabels[selectedNationality.category].en})`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl font-bold text-sm transition-colors duration-200"
                >
                  <WhatsAppIcon size={18} />
                  {t('requestWhatsApp')}
                </a>

                <a
                  href="tel:+966547123180"
                  className="flex items-center justify-center gap-2 px-4 bg-gray-100 hover:bg-gray-200 text-brand-dark py-3 rounded-xl font-bold text-sm transition-colors duration-200"
                  title={t('callUs')}
                >
                  <Phone size={18} />
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
