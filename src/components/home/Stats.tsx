import {useTranslations} from 'next-intl';
import Image from 'next/image';
import {Users, Building2, Clock, Globe} from 'lucide-react';

export default function Stats() {
  const t = useTranslations('stats');

  const stats = [
    {icon: <Users size={28} />, value: '5,000+', label: t('workers')},
    {icon: <Building2 size={28} />, value: '1,200+', label: t('clients')},
    {icon: <Clock size={28} />, value: '15+', label: t('years')},
    {icon: <Globe size={28} />, value: '12+', label: t('countries')},
  ];

  return (
    <section id="stats" className="relative py-16 overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=60&auto=format&fit=crop"
          alt="Office building"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-dark/90" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 py-4">
              <div className="w-14 h-14 bg-brand-orange/15 rounded-2xl flex items-center justify-center text-brand-orange mb-3">
                {stat.icon}
              </div>
              <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-white/60 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
