/** Static SaaS fallback when ERP /site is disabled or unreachable. */
export type SiteConfig = {
  name: { en: string | null; ar: string | null };
  tagline: { en: string | null; ar: string | null };
  logo_url: string | null;
  phone: string | null;
  phone_tel: string | null;
  whatsapp: string | null;
  whatsapp_url: string | null;
  email: string | null;
  address: { en: string | null; ar: string | null };
  hours: { en: string | null; ar: string | null };
  cr_number: string | null;
  license_number: string | null;
  musaned_id: string | null;
  map_embed_url: string | null;
  map_link_url: string | null;
};

export const STATIC_SITE: SiteConfig = {
  name: { en: 'Alsaffar Manpower Recruitment', ar: 'الصفار للاستقدام' },
  tagline: {
    en: 'Professional manpower recruitment for Saudi Arabia — licensed, Musaned-compliant, after-care guaranteed.',
    ar: 'استقدام عمالة محترف للمملكة العربية السعودية — مرخّص ومتوافق مع مساند مع ضمان ما بعد التوظيف.',
  },
  logo_url: '/alsaffar.png',
  phone: '+966 920 021 201',
  phone_tel: 'tel:+966920021201',
  whatsapp: '966920021201',
  whatsapp_url: 'https://wa.me/966920021201',
  email: 'support@alsaffar.pro',
  address: {
    en: 'Eastern Province, Saudi Arabia',
    ar: 'المنطقة الشرقية، المملكة العربية السعودية',
  },
  hours: {
    en: 'Saturday to Thursday\n9:00 AM – 12:00 PM\n3:00 PM – 9:00 PM',
    ar: 'السبت إلى الخميس\n9:00 صباحاً – 12:00 مساءً\n3:00 مساءً – 9:00 مساءً',
  },
  cr_number: '2053034759',
  license_number: '3704231',
  musaned_id: null,
  map_embed_url:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.089853907742!2d50.0433538!3d26.5823757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e4a0092c0a2a67b%3A0xae97e0b280d49791!2sAlsaffar%20Recruitment%20Manpower!5e1!3m2!1sen!2sus!4v1718338167823!5m2!1sen!2sus',
  map_link_url: 'https://www.google.com/maps?q=26.5823757,50.0433538&z=17&t=k',
};

/** Merge sparse API payload onto static defaults (null/empty → keep static). */
export function mergeSiteConfig(partial: Partial<SiteConfig> | null | undefined): SiteConfig {
  const p = partial ?? {};
  const pick = (v: string | null | undefined, fallback: string | null) =>
    v && String(v).trim() !== '' ? String(v).trim() : fallback;

  return {
    name: {
      en: pick(p.name?.en, STATIC_SITE.name.en),
      ar: pick(p.name?.ar, STATIC_SITE.name.ar),
    },
    tagline: {
      en: pick(p.tagline?.en, STATIC_SITE.tagline.en),
      ar: pick(p.tagline?.ar, STATIC_SITE.tagline.ar),
    },
    logo_url: pick(p.logo_url, STATIC_SITE.logo_url),
    phone: pick(p.phone, STATIC_SITE.phone),
    phone_tel: pick(p.phone_tel, STATIC_SITE.phone_tel),
    whatsapp: pick(p.whatsapp, STATIC_SITE.whatsapp),
    whatsapp_url: pick(p.whatsapp_url, STATIC_SITE.whatsapp_url),
    email: pick(p.email, STATIC_SITE.email),
    address: {
      en: pick(p.address?.en, STATIC_SITE.address.en),
      ar: pick(p.address?.ar, STATIC_SITE.address.ar),
    },
    hours: {
      en: pick(p.hours?.en, STATIC_SITE.hours.en),
      ar: pick(p.hours?.ar, STATIC_SITE.hours.ar),
    },
    cr_number: pick(p.cr_number, STATIC_SITE.cr_number),
    license_number: pick(p.license_number, STATIC_SITE.license_number),
    musaned_id: pick(p.musaned_id, STATIC_SITE.musaned_id),
    map_embed_url: pick(p.map_embed_url, STATIC_SITE.map_embed_url),
    map_link_url: pick(p.map_link_url, STATIC_SITE.map_link_url),
  };
}
