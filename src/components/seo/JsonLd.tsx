import { SITE_URL } from '@/lib/seo';

// Structured data for brand / local searches (knowledge panel, "alsaffar office").
export default function JsonLd({ locale }: { locale: string }) {
  const isAr = locale === 'ar';
  const name = isAr ? 'الصفار للاستقدام' : 'Alsaffar Manpower Recruitment';
  const alternateName = isAr ? 'Alsaffar Manpower Recruitment' : 'الصفار للاستقدام';

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name,
        alternateName,
        url: SITE_URL,
        logo: `${SITE_URL}/alsaffar.png`,
        image: `${SITE_URL}/alsaffar.png`,
        email: 'support@alsaffar.pro',
        telephone: '+966920021201',
        sameAs: [
          'https://maps.google.com/maps?cid=12580771141352986513',
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#localbusiness`,
        name,
        alternateName,
        url: SITE_URL,
        logo: `${SITE_URL}/alsaffar.png`,
        image: `${SITE_URL}/alsaffar.png`,
        email: 'support@alsaffar.pro',
        telephone: '+966920021201',
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressRegion: isAr ? 'المنطقة الشرقية' : 'Eastern Province',
          addressCountry: 'SA',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 26.5823757,
          longitude: 50.0433538,
        },
        hasMap: 'https://maps.google.com/maps?cid=12580771141352986513',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '09:00',
            closes: '12:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
            opens: '15:00',
            closes: '21:00',
          },
        ],
        sameAs: [
          'https://maps.google.com/maps?cid=12580771141352986513',
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
