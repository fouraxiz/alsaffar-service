'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function ContactPage() {
  const t = useTranslations('contactPage');
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', service: '', message: '' });
  const [phoneError, setPhoneError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero banner */}
      <section className="bg-brand-dark pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-white/50 text-sm mb-4 font-medium">Alsaffar / {t('title')}</div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">{t('title')}</h1>
          <p className="text-white/70 text-xl max-w-2xl leading-relaxed">{t('subtitle')}</p>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="bg-brand-orange">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <a href="tel:+966920021201" className="flex items-center gap-2 font-bold hover:text-white/80 transition-colors">
              <Phone size={18} />
              <span dir="ltr">+966 920 021 201</span>
            </a>
            <span className="text-white/30 hidden sm:block self-center">|</span>
            <a href="mailto:support@alsaffar.pro" className="flex items-center gap-2 font-bold hover:text-white/80 transition-colors">
              <Mail size={18} />
              support@alsaffar.pro
            </a>
            <span className="text-white/30 hidden sm:block self-center">|</span>
            <span className="flex items-center gap-2 font-bold whitespace-pre-line text-sm sm:text-base leading-tight">
              <Clock size={18} />
              {t('hoursValue')}
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

            {/* Contact form */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-black text-brand-dark mb-2">
                {locale === 'ar' ? 'أرسل لنا رسالة' : 'Send Us a Message'}
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                {locale === 'ar' ? 'سنرد عليك في أقرب وقت ممكن' : "We'll get back to you as soon as possible"}
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-brand-gray rounded-2xl">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                    <Send size={36} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark mb-2">
                    {locale === 'ar' ? 'تم الإرسال!' : 'Message Sent!'}
                  </h3>
                  <p className="text-gray-500 text-lg">{t('form.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold text-brand-dark mb-2">
                        {t('form.name')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={t('form.namePlaceholder')}
                        className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-orange transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-brand-dark mb-2">
                        {t('form.phone')} *
                      </label>
                      <div
                        dir="ltr"
                        className={`w-full border-2 rounded-xl px-5 py-4 transition-colors focus-within:border-brand-orange ${
                          phoneError ? 'border-red-400' : 'border-gray-200'
                        }`}
                      >
                        <PhoneInput
                          international
                          withCountryCallingCode
                          defaultCountry={undefined}
                          value={form.phone}
                          onChange={(value) => {
                            setForm({ ...form, phone: value || '' });
                            if (phoneError) setPhoneError(false);
                          }}
                          placeholder={t('form.phonePlaceholder')}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-red-500 text-sm mt-1.5">
                          {locale === 'ar' ? 'يرجى إدخال رقم هاتف صحيح مع رمز الدولة' : 'Please enter a valid phone number with country code'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-dark mb-2">
                      {t('form.service')}
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-brand-dark focus:outline-none focus:border-brand-orange transition-colors bg-white"
                    >
                      <option value="">{locale === 'ar' ? 'اختر الخدمة' : 'Select a service'}</option>
                      <option value="domestic">{locale === 'ar' ? 'عمالة منزلية' : 'Domestic Workers'}</option>
                      <option value="drivers">{locale === 'ar' ? 'سائقون' : 'Drivers'}</option>
                      <option value="skilled">{locale === 'ar' ? 'عمالة ماهرة' : 'Skilled Workers'}</option>
                      <option value="corporate">{locale === 'ar' ? 'توظيف مؤسسي' : 'Corporate Staffing'}</option>
                      <option value="visa">{locale === 'ar' ? 'تأشيرات' : 'Visa Processing'}</option>
                      <option value="other">{locale === 'ar' ? 'أخرى' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-dark mb-2">
                      {t('form.message')}
                    </label>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={t('form.messagePlaceholder')}
                      className="w-full border-2 border-gray-200 rounded-xl px-5 py-4 text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-orange transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-4 rounded-xl transition-colors duration-200 text-lg"
                  >
                    <Send size={20} />
                    {t('form.submit')}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-3xl font-black text-brand-dark mb-6">
                {locale === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
              </h2>

              <a
                href="https://maps.google.com/maps?cid=12580771141352986513&ll=26.5823757,50.0433538&z=17&t=k"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-brand-gray hover:bg-brand-orange/5 rounded-2xl p-6 transition-colors group"
              >
                <div className="w-14 h-14 bg-brand-orange/10 group-hover:bg-brand-orange rounded-xl flex items-center justify-center text-brand-orange group-hover:text-white flex-shrink-0 transition-colors">
                  <MapPin size={26} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">{t('office')}</div>
                  <div className="font-bold text-brand-dark text-lg">
                    {locale === 'ar' ? 'المنطقة الشرقية، المملكة العربية السعودية' : 'Eastern Province, Saudi Arabia'}
                  </div>
                </div>
              </a>

              <a
                href="tel:+966920021201"
                className="flex items-start gap-4 bg-brand-gray hover:bg-brand-orange/5 rounded-2xl p-6 transition-colors group"
              >
                <div className="w-14 h-14 bg-brand-orange/10 group-hover:bg-brand-orange rounded-xl flex items-center justify-center text-brand-orange group-hover:text-white flex-shrink-0 transition-colors">
                  <Phone size={26} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">
                    {locale === 'ar' ? 'الهاتف' : 'Phone'}
                  </div>
                  <div className="font-bold text-brand-dark text-lg" dir="ltr">+966 920 021 201</div>
                </div>
              </a>

              <a
                href="mailto:support@alsaffar.pro"
                className="flex items-start gap-4 bg-brand-gray hover:bg-brand-orange/5 rounded-2xl p-6 transition-colors group"
              >
                <div className="w-14 h-14 bg-brand-orange/10 group-hover:bg-brand-orange rounded-xl flex items-center justify-center text-brand-orange group-hover:text-white flex-shrink-0 transition-colors">
                  <Mail size={26} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">
                    {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  </div>
                  <div className="font-bold text-brand-dark text-lg">support@alsaffar.pro</div>
                </div>
              </a>

              <div className="flex items-start gap-4 bg-brand-gray rounded-2xl p-6">
                <div className="w-14 h-14 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange flex-shrink-0">
                  <Clock size={26} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">{t('hours')}</div>
                  <div className="font-bold text-brand-dark text-lg whitespace-pre-line leading-tight">{t('hoursValue')}</div>
                </div>
              </div>

              <div className="pt-2 space-y-3">
                <a
                  href="https://wa.me/966920021201"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-4 rounded-xl transition-colors duration-200 text-lg"
                >
                  <WhatsAppIcon size={20} />
                  {t('whatsappCta')}
                </a>
                <a
                  href="tel:+966920021201"
                  className="flex items-center justify-center gap-2 w-full border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white font-bold py-4 rounded-xl transition-colors duration-200 text-lg"
                >
                  <Phone size={20} />
                  {t('callCta')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map */}
      <section className="h-96 w-full bg-gray-100 border-t border-gray-200 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3570.089853907742!2d50.0433538!3d26.5823757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e4a0092c0a2a67b%3A0xae97e0b280d49791!2sAlsaffar%20Recruitment%20Manpower!5e1!3m2!1sen!2sus!4v1718338167823!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Alsaffar Location"
        />
      </section>
    </>
  );
}
