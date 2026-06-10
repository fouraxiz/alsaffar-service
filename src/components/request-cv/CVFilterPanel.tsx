'use client';

import { useTranslations, useLocale } from 'next-intl';
import { 
  NATIONALITIES_LIST, 
  JOB_TYPES, 
  SERVICE_TYPES, 
  EXPERIENCE_RANGES 
} from '@/data/cvData';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

export type FilterState = {
  nationality: string[];
  gender: 'male' | 'female' | null;
  ageRange: [number, number];
  jobType: string[];
  salaryRange: [number, number];
  experience: string | null;
  serviceType: string[];
};

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
};

export default function CVFilterPanel({ filters, setFilters }: Props) {
  const t = useTranslations('requestCV.filters');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleNationality = (code: string) => {
    setFilters(prev => ({
      ...prev,
      nationality: prev.nationality.includes(code)
        ? prev.nationality.filter(n => n !== code)
        : [...prev.nationality, code]
    }));
  };

  const toggleJobType = (key: string) => {
    setFilters(prev => ({
      ...prev,
      jobType: prev.jobType.includes(key)
        ? prev.jobType.filter(j => j !== key)
        : [...prev.jobType, key]
    }));
  };

  const toggleServiceType = (key: string) => {
    setFilters(prev => ({
      ...prev,
      serviceType: prev.serviceType.includes(key)
        ? prev.serviceType.filter(v => v !== key)
        : [...prev.serviceType, key]
    }));
  };

  const clearAll = () => {
    setFilters({
      nationality: [],
      gender: null,
      ageRange: [20, 55],
      jobType: [],
      salaryRange: [1000, 5000],
      experience: null,
      serviceType: [],
    });
  };

  const activeFilterCount = 
    filters.nationality.length + 
    (filters.gender ? 1 : 0) + 
    filters.jobType.length + 
    (filters.experience ? 1 : 0) + 
    filters.serviceType.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Mobile Header (Toggle) */}
      <div 
        className="lg:hidden flex items-center justify-between p-4 cursor-pointer"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-brand-dark">{t('title')}</span>
          {activeFilterCount > 0 && (
            <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      <div className={`p-5 ${isMobileOpen ? 'block' : 'hidden lg:block'}`}>
        
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-brand-dark">{t('title')}</h3>
            {activeFilterCount > 0 && (
              <span className="bg-brand-orange text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button 
              onClick={clearAll}
              className="text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <X size={14} />
              {t('clearAll')}
            </button>
          )}
        </div>

        {/* Mobile Clear All */}
        {activeFilterCount > 0 && (
          <div className="lg:hidden mb-4 flex justify-end">
            <button 
              onClick={clearAll}
              className="text-xs font-bold text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-1"
            >
              <X size={14} />
              {t('clearAll')}
            </button>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Nationality */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">{t('nationality')}</h4>
            <div className="flex flex-wrap gap-2">
              {NATIONALITIES_LIST.map((nat) => (
                <button
                  key={nat.code}
                  onClick={() => toggleNationality(nat.code)}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-colors border ${
                    filters.nationality.includes(nat.code)
                      ? 'bg-brand-orange/10 border-brand-orange text-brand-orange-dark'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {isAr ? nat.ar : nat.en}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Job Type */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">{t('jobType')}</h4>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((job) => (
                <button
                  key={job.key}
                  onClick={() => toggleJobType(job.key)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors border ${
                    filters.jobType.includes(job.key)
                      ? 'bg-brand-orange border-brand-orange text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {isAr ? job.ar : job.en}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Gender */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">{t('gender')}</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, gender: prev.gender === 'female' ? null : 'female' }))}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                  filters.gender === 'female'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                {t('female')}
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, gender: prev.gender === 'male' ? null : 'male' }))}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors border ${
                  filters.gender === 'male'
                    ? 'bg-sky-50 border-sky-200 text-sky-700'
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                {t('male')}
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Experience */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">{t('experience')}</h4>
            <div className="flex flex-col gap-2">
              {EXPERIENCE_RANGES.map((range) => (
                <label key={range.key} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="radio" 
                      name="experience" 
                      checked={filters.experience === range.key}
                      onChange={() => setFilters(prev => ({ ...prev, experience: prev.experience === range.key ? null : range.key }))}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-orange transition-colors" />
                    <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-orange scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {isAr ? range.ar : range.en}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Service Type (formerly Visa Type) */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">{t('serviceType')}</h4>
            <div className="flex flex-col gap-2">
              {SERVICE_TYPES.map((svc) => (
                <label key={svc.key} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input 
                      type="checkbox"
                      checked={filters.serviceType.includes(svc.key)}
                      onChange={() => toggleServiceType(svc.key)}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-brand-orange peer-checked:bg-brand-orange transition-colors flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    {isAr ? svc.ar : svc.en}
                  </span>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
