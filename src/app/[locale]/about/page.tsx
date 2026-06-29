import {setRequestLocale} from 'next-intl/server';
import {useTranslations, useLocale} from 'next-intl';
import {Target, Eye, Award, MapPin, Clock, FileText, Shield, Zap, Heart} from 'lucide-react';
import Image from 'next/image';
import type {Metadata} from 'next';
import {buildAlternates} from '@/lib/seo';
import PageBanner from '@/components/shared/PageBanner';

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  const isAr = locale === 'ar';
  const title = isAr ? 'من نحن' : 'About Us';
  const description = isAr
    ? 'تعرف على شركة الصفار للاستقدام — خبرة وموثوقية في استقدام العمالة بالمملكة العربية السعودية.'
    : 'Learn about Alsaffar Manpower Recruitment — trusted, licensed worker recruitment in Saudi Arabia.';
  const alternates = buildAlternates(locale, '/about');
  return {
    title,
    description,
    alternates,
    openGraph: {title, description, url: alternates.canonical},
  };
}

function AboutContent() {
  const t = useTranslations('about');
  const locale = useLocale();

  const credentials = [
    {icon: <FileText size={26} />, label: t('crNumber'), value: '2053034759'},
    {icon: <FileText size={26} />, label: t('licenseNumber'), value: '3704231'},
    {icon: <Award size={26} />, label: t('musanedId'), value: '3704231'},
    {icon: <MapPin size={26} />, label: t('officeAddress'), value: locale === 'ar' ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'},
    {icon: <Clock size={26} />, label: t('officeHours'), value: t('hoursValue')},
  ];

  const stats = [
    {number: '15+', label: locale === 'ar' ? 'سنة خبرة' : 'Years Experience'},
    {number: '5,000+', label: locale === 'ar' ? 'عامل تم توظيفه' : 'Workers Placed'},
    {number: '12+', label: locale === 'ar' ? 'دولة مصدر' : 'Source Countries'},
    {number: '98%', label: locale === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'},
  ];

  const values = [
    {icon: <Shield size={30} />, key: 'integrity', color: 'text-brand-orange bg-brand-orange/10', title: locale === 'ar' ? 'النزاهة' : 'Integrity', desc: locale === 'ar' ? 'نلتزم بالشفافية والأمانة في كل ما نقدمه' : 'Transparency and honesty in everything we do'},
    {icon: <Award size={30} />, key: 'quality', color: 'text-violet-600 bg-violet-50', title: locale === 'ar' ? 'الجودة' : 'Quality', desc: locale === 'ar' ? 'نختار فقط العمالة المؤهلة والمدربة' : 'Only qualified, screened, and trained workers'},
    {icon: <Zap size={30} />, key: 'speed', color: 'text-sky-600 bg-sky-50', title: locale === 'ar' ? 'السرعة' : 'Speed', desc: locale === 'ar' ? 'نسرّع عمليات الاستقدام لتوفير وقتك' : 'Fast-tracked processes to save your time'},
    {icon: <Heart size={30} />, key: 'support', color: 'text-rose-600 bg-rose-50', title: locale === 'ar' ? 'الدعم' : 'Support', desc: locale === 'ar' ? 'خدمة ما بعد التوظيف ودعم مستمر' : 'After-placement service and ongoing care'},
  ];

  return (
    <>
      {/* Hero banner */}
      <div>
        <PageBanner
          title={t('title')}
          subtitle={t('subtitle')}
          badgeText={locale === 'ar' ? 'من نحن' : 'Who We Are'}
          iconType="about"
        />
      </div>

      {/* Stats bar */}
      <section className="bg-brand-orange">
        <div className="max-w-7xl mx-auto px-4 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-black">{stat.number}</div>
                <div className="text-white/80 text-sm font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-5">
                {locale === 'ar' ? 'قصتنا' : 'Our Story'}
              </div>
              <h2 className="text-4xl font-black text-brand-dark mb-6 leading-tight">
                {locale === 'ar' ? 'رائدون في استقدام العمالة منذ أكثر من 15 عامًا' : 'Leading Recruitment Excellence for 15+ Years'}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">{t('story')}</p>
            </div>
            <div className="relative min-h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Recruitment office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-brand-dark">
              {locale === 'ar' ? 'مهمتنا ورؤيتنا' : 'Mission & Vision'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-10 shadow-sm border-b-4 border-brand-orange">
              <div className="w-16 h-16 bg-brand-orange/10 rounded-2xl flex items-center justify-center mb-6">
                <Target size={34} className="text-brand-orange" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-4">{t('mission')}</h3>
              <p className="text-gray-500 text-lg leading-relaxed">{t('missionText')}</p>
            </div>
            <div className="bg-brand-dark rounded-2xl p-10 shadow-sm">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye size={34} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{t('vision')}</h3>
              <p className="text-white/70 text-lg leading-relaxed">{t('visionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="inline-block bg-brand-orange/10 text-brand-orange text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              {locale === 'ar' ? 'قيمنا' : 'Our Values'}
            </div>
            <h2 className="text-4xl font-black text-brand-dark">
              {locale === 'ar' ? 'ما الذي يميزنا' : 'What Sets Us Apart'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div key={val.key} className="text-center p-8 rounded-2xl bg-brand-gray hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 ${val.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  {val.icon}
                </div>
                <h3 className="text-xl font-black text-brand-dark mb-3">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-28 bg-brand-dark relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{background: 'radial-gradient(ellipse at 75% 25%, rgba(232,135,10,0.07) 0%, transparent 60%)'}}
        />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="w-12 h-1 bg-brand-orange mx-auto mb-4 rounded-full" />
            <div className="inline-block bg-white/10 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
              {locale === 'ar' ? 'ترخيص رسمي' : 'Officially Licensed'}
            </div>
            <h2 className="text-4xl font-black text-white">{t('credentials')}</h2>
            <p className="text-white/50 mt-3 text-base max-w-md mx-auto">
              {locale === 'ar'
                ? 'مرخصون رسمياً للعمل في جميع أنحاء المملكة العربية السعودية'
                : 'Fully licensed to operate across Saudi Arabia'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* License Credentials — 3 cards, 2-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              {credentials.slice(0, 3).map((cred, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-5 bg-white/5 hover:bg-white/10 rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-orange/10 border-t border-b border-white/10 ${locale === 'ar' ? 'border-l border-l-white/10 border-r-4 border-r-brand-orange' : 'border-r border-r-white/10 border-l-4 border-l-brand-orange'} ${i === 2 ? 'md:col-span-2' : ''}`}
                >
                  <div className="w-16 h-16 bg-brand-orange/15 ring-1 ring-brand-orange/30 rounded-xl flex items-center justify-center text-brand-orange flex-shrink-0">
                    {cred.icon}
                  </div>
                  <div>
                    <div className="text-brand-orange/70 text-xs uppercase tracking-wider font-medium mb-1.5">
                      {cred.label}
                    </div>
                    <div className="font-bold text-white text-xl whitespace-pre-line">{cred.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs uppercase tracking-widest">
                {locale === 'ar' ? 'معلومات التواصل' : 'Contact Details'}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Contact Details — 2 cards, 2-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {credentials.slice(3).map((cred, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-5 bg-white/5 hover:bg-white/10 rounded-2xl p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-brand-orange/10 border-t border-b border-white/10 ${locale === 'ar' ? 'border-l border-l-white/10 border-r-4 border-r-brand-orange' : 'border-r border-r-white/10 border-l-4 border-l-brand-orange'}`}
                >
                  <div className="w-16 h-16 bg-brand-orange/15 ring-1 ring-brand-orange/30 rounded-xl flex items-center justify-center text-brand-orange flex-shrink-0">
                    {cred.icon}
                  </div>
                  <div>
                    <div className="text-brand-orange/70 text-xs uppercase tracking-wider font-medium mb-1.5">
                      {cred.label}
                    </div>
                    <div className="font-bold text-white text-xl whitespace-pre-line">{cred.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function AboutPage({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}
