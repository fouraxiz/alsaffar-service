'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FilterState } from './CVFilterPanel';
import { Send, FileText, Phone, User, CheckCircle2, Search, MessageSquare } from 'lucide-react';

type Props = {
  filters: FilterState;
  onClose: () => void; // Used to clear filters after success
};

export default function NoMatchForm({ filters, onClose }: Props) {
  const t = useTranslations('requestCV.noMatch');
  const tGallery = useTranslations('requestCV.gallery');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    description: '',
    phone: '',
    idNumber: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const formatFilters = () => {
    const parts = [];
    if (filters.nationality.length > 0) parts.push(`Nationalities: ${filters.nationality.join(', ')}`);
    if (filters.gender) parts.push(`Gender: ${filters.gender}`);
    if (filters.jobType.length > 0) parts.push(`Jobs: ${filters.jobType.join(', ')}`);
    if (filters.experience) parts.push(`Experience: ${filters.experience}`);
    if (filters.serviceType.length > 0) parts.push(`Service Types: ${filters.serviceType.join(', ')}`);
    return parts.join(' | ') || 'None selected';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In a real app, this would be an API call.
    // For now, we simulate formatting a WhatsApp message and showing success.
    const message = `
*New Specific Worker Request*
Phone: ${form.phone}
ID: ${form.idNumber}
Description: ${form.description}

*Applied Filters:*
${formatFilters()}
    `.trim();

    console.log('Sending message:', message);
    // You could also open WhatsApp directly here
    // window.open(`https://wa.me/966547123180?text=${encodeURIComponent(message)}`, '_blank');

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
      {submitted ? (
        <div className="p-10 text-center flex flex-col items-center justify-center h-full">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-2xl font-black text-brand-dark mb-3">{t('successTitle')}</h3>
          <p className="text-gray-500 leading-relaxed mb-8">{t('successDesc')}</p>
          <button
            onClick={onClose}
            className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white py-4 rounded-xl font-bold text-lg transition-colors"
          >
            {t('backToBrowse')}
          </button>
        </div>
      ) : (
        <div className="p-8 overflow-y-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-2">{t('title')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('description')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('descLabel')} *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('descPlaceholder')}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-orange transition-colors resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('phoneLabel')} *</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t('phonePlaceholder')}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 ps-10 text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-orange transition-colors text-sm"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('idLabel')} *</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={form.idNumber}
                  onChange={e => setForm(prev => ({ ...prev, idNumber: e.target.value }))}
                  placeholder={t('idPlaceholder')}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 ps-10 text-brand-dark placeholder:text-gray-400 focus:outline-none focus:border-brand-orange transition-colors text-sm"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-4 rounded-xl transition-colors duration-200"
              >
                <Send size={18} />
                {t('submit')}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full mt-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-bold py-4 rounded-xl transition-colors duration-200"
              >
                {t('backToBrowse')} {/* Reusing translation for 'Back' */}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
