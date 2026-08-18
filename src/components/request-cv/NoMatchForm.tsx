'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { FilterState, FilterOptions, DEFAULT_AGE_RANGE } from './CVFilterPanel';
import { Send, FileText, Phone, User, CheckCircle2 } from 'lucide-react';

type Props = {
  filters: FilterState;
  options: FilterOptions;
  onClose: () => void;
  onAdjustFilters: () => void;
};

function optionLabel(options: { value: string; label_en?: string | null; label_ar?: string | null }[], value: string, isAr: boolean) {
  const match = options.find((o) => o.value === value);
  return (isAr ? match?.label_ar : match?.label_en) || value;
}

export default function NoMatchForm({ filters, options, onClose, onAdjustFilters }: Props) {
  const t = useTranslations('requestCV.noMatch');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [form, setForm] = useState({
    description: '',
    phone: '',
    idNumber: '',
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const appliedFilters = [
    ...filters.nationality.map((code) => optionLabel(options.nationalities, code, isAr)),
    ...filters.jobType.map((key) => optionLabel(options.jobTypes, key, isAr)),
    ...filters.serviceType.map((key) => optionLabel(options.serviceTypes, key, isAr)),
    filters.gender ? optionLabel(options.genders, filters.gender, isAr) : null,
    filters.experience ? optionLabel(options.experienceRanges, filters.experience, isAr) : null,
    filters.ageRange[0] !== DEFAULT_AGE_RANGE[0] || filters.ageRange[1] !== DEFAULT_AGE_RANGE[1]
      ? `${filters.ageRange[0]}–${filters.ageRange[1]}`
      : null,
  ].filter((v): v is string => !!v);

  const formatFilters = () => {
    const parts = [];
    if (filters.nationality.length > 0) {
      parts.push(`Nationalities: ${filters.nationality.map((c) => optionLabel(options.nationalities, c, false)).join(', ')}`);
    }
    if (filters.gender) parts.push(`Gender: ${optionLabel(options.genders, filters.gender, false)}`);
    if (filters.ageRange[0] !== DEFAULT_AGE_RANGE[0] || filters.ageRange[1] !== DEFAULT_AGE_RANGE[1]) {
      parts.push(`Age: ${filters.ageRange[0]}-${filters.ageRange[1]}`);
    }
    if (filters.jobType.length > 0) {
      parts.push(`Jobs: ${filters.jobType.map((j) => optionLabel(options.jobTypes, j, false)).join(', ')}`);
    }
    if (filters.experience) {
      parts.push(`Experience: ${optionLabel(options.experienceRanges, filters.experience, false)}`);
    }
    if (filters.serviceType.length > 0) {
      parts.push(`Service Types: ${filters.serviceType.map((s) => optionLabel(options.serviceTypes, s, false)).join(', ')}`);
    }
    return parts.join(' | ') || 'None selected';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: form.phone.trim(),
          description: form.description.trim(),
          idNumber: form.idNumber.trim(),
          filters: formatFilters(),
          website: form.website,
        }),
      });
      if (!res.ok) throw new Error('submit_failed');
      setSubmitted(true);
    } catch {
      setError(t('submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="no-match-title">
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
            <h3 id="no-match-title" className="text-2xl font-black text-brand-dark mb-2">{t('title')}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('description')}</p>
            {appliedFilters.length > 0 && (
              <div className="mt-4 text-start">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">{t('appliedFilters')}</p>
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.map((label) => (
                    <span key={label} className="bg-brand-orange/10 text-brand-orange text-xs font-bold px-2.5 py-1 rounded-full">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('descLabel')} *</label>
              <textarea
                required
                minLength={8}
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

            {error && (
              <p className="text-sm font-semibold text-red-600 text-center">{error}</p>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors duration-200"
              >
                <Send size={18} />
                {t('submit')}
              </button>

              <button
                type="button"
                onClick={onAdjustFilters}
                className="w-full mt-3 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 font-bold py-4 rounded-xl transition-colors duration-200"
              >
                {t('adjustFilters')}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>
  );
}
