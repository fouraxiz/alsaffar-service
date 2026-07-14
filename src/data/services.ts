/**
 * Static service-card fallbacks + presentation defaults (icons, images, WA copy).
 * Live titles/descriptions/images come from ERP GET /services when enabled.
 */

export type ServiceUiKey =
  | 'domestic'
  | 'drivers'
  | 'skilled'
  | 'corporate'
  | 'visa'
  | 'followUp'
  | 'support';

export type StaticService = {
  /** ERP `service_key` (seeded keys). */
  serviceKey: string;
  /** Home section i18n key under `services.*`. */
  homeKey: Exclude<ServiceUiKey, 'support'>;
  /** Services page i18n key under `servicesPage.*`. */
  pageKey: Exclude<ServiceUiKey, 'followUp'>;
  icon: string;
  image: string;
  pageImage: string;
  bg: string;
  gradient: string;
  waMsgEn: string;
  waMsgAr: string;
};

export const STATIC_SERVICES: StaticService[] = [
  {
    serviceKey: 'maid-services',
    homeKey: 'domestic',
    pageKey: 'domestic',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80&auto=format&fit=crop',
    pageImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    bg: 'bg-rose-500',
    gradient: 'from-rose-600/90 to-rose-900/90',
    waMsgEn: 'Hello! I am interested in Domestic Worker recruitment services.',
    waMsgAr: 'مرحباً! أنا مهتم بخدمات استقدام العمالة المنزلية.',
  },
  {
    serviceKey: 'drivers',
    homeKey: 'drivers',
    pageKey: 'drivers',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80&auto=format&fit=crop',
    pageImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    bg: 'bg-sky-500',
    gradient: 'from-sky-600/90 to-sky-900/90',
    waMsgEn: 'Hello! I am interested in Driver recruitment services.',
    waMsgAr: 'مرحباً! أنا مهتم بخدمات استقدام السائقين.',
  },
  {
    serviceKey: 'skilled-workers',
    homeKey: 'skilled',
    pageKey: 'skilled',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&q=80&auto=format&fit=crop',
    pageImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    bg: 'bg-amber-500',
    gradient: 'from-amber-600/90 to-amber-900/90',
    waMsgEn: 'Hello! I am interested in Skilled Worker recruitment.',
    waMsgAr: 'مرحباً! أنا مهتم بخدمات استقدام العمالة الماهرة.',
  },
  {
    serviceKey: 'corporate-staffing',
    homeKey: 'corporate',
    pageKey: 'corporate',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80&auto=format&fit=crop',
    pageImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    bg: 'bg-violet-500',
    gradient: 'from-violet-600/90 to-violet-900/90',
    waMsgEn: 'Hello! I am interested in Corporate Staffing services.',
    waMsgAr: 'مرحباً! أنا مهتم بخدمات التوظيف المؤسسي.',
  },
  {
    serviceKey: 'visa-processing',
    homeKey: 'visa',
    pageKey: 'visa',
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&q=80&auto=format&fit=crop',
    pageImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    bg: 'bg-emerald-500',
    gradient: 'from-emerald-600/90 to-emerald-900/90',
    waMsgEn: 'Hello! I need help with Visa Processing services.',
    waMsgAr: 'مرحباً! أحتاج مساعدة في خدمات معالجة التأشيرات.',
  },
  {
    serviceKey: 'after-placement-support',
    homeKey: 'followUp',
    pageKey: 'support',
    icon: 'HeartHandshake',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=500&q=80&auto=format&fit=crop',
    pageImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    bg: 'bg-brand-orange',
    gradient: 'from-orange-600/90 to-orange-900/90',
    waMsgEn: 'Hello! I need After-Placement Support services.',
    waMsgAr: 'مرحباً! أحتاج خدمات الدعم بعد التوظيف.',
  },
];
