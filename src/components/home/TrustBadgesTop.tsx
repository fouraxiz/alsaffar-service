import {useLocale} from 'next-intl';
import {ShieldCheck, Award, Hash} from 'lucide-react';

export default function TrustBadgesTop() {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const badges = [
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="16" fill="#0F7A5A" />
          <text x="50" y="58" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" fontFamily="Arial">مساند</text>
        </svg>
      ),
      title: isAr ? 'منصة مساند' : 'Musaned Platform',
      subtitle: isAr ? 'شريك معتمد' : 'Certified Partner',
      color: 'border-teal-200 bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      icon: (
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="16" fill="#1D4ED8" />
          <text x="50" y="52" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="Arial">وزارة</text>
          <text x="50" y="70" textAnchor="middle" fill="white" fontSize="11" fontFamily="Arial">الموارد</text>
        </svg>
      ),
      title: isAr ? 'وزارة الموارد البشرية' : 'Ministry of Human Resources',
      subtitle: isAr ? 'مرخص رسمياً' : 'Officially Licensed',
      color: 'border-blue-200 bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      icon: <Hash size={36} className="text-brand-orange" />,
      title: isAr ? 'السجل التجاري' : 'Commercial Registration',
      subtitle: 'CR: 2053034759',
      color: 'border-orange-200 bg-orange-50',
      textColor: 'text-brand-orange',
    },
    {
      icon: <Award size={36} className="text-purple-600" />,
      title: isAr ? 'رقم الترخيص' : 'License Number',
      subtitle: isAr ? 'ترخيص: 3704231' : 'LIC: 3704231',
      color: 'border-purple-200 bg-purple-50',
      textColor: 'text-purple-700',
    },
  ];

  return (
    <section className="py-10 bg-white/50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-full px-4 py-1.5 text-sm font-bold mb-3">
            <ShieldCheck size={15} />
            {isAr ? 'جهات اعتماد رسمية' : 'Official Accreditations'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-brand-dark">
            {isAr ? 'نعمل تحت إشراف الجهات الرسمية' : 'Regulated by Official Saudi Authorities'}
          </h2>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center gap-3 rounded-2xl border-2 ${badge.color} p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="w-16 h-16 flex items-center justify-center">
                {badge.icon}
              </div>
              <div>
                <div className={`font-black text-sm sm:text-base ${badge.textColor} leading-tight`}>
                  {badge.title}
                </div>
                <div className="text-gray-500 text-xs mt-1 font-medium">{badge.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
