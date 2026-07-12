// Canonical nationality list for the home "Choose Your Preferred Nationality"
// section. Used as the instant/SSR render and as the static fallback when the
// ERP /countries feed is disabled or unreachable (see src/lib/getCountries.ts).

export type Nationality = {
  /** ISO2 code — keys the flag CDN and the Browse-CVs nationality filter. */
  code: string;
  nameAr: string;
  nameEn: string;
  category: 'domestic' | 'driver' | 'skilled';
  priceRange: string;
};

export const STATIC_NATIONALITIES: Nationality[] = [
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

// ERP `website_country_pages` slug → the ISO2 code the site uses everywhere else.
export const SLUG_TO_ISO: Record<string, string> = {
  filipino: 'ph',
  indonesian: 'id',
  'sri-lankan': 'lk',
  ethiopian: 'et',
  indian: 'in',
  pakistani: 'pk',
  bangladeshi: 'bd',
  nepali: 'np',
  ugandan: 'ug',
  kenyan: 'ke',
  ghanaian: 'gh',
  tanzanian: 'tz',
};
