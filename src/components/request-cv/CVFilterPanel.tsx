'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useState } from 'react';

export type FilterOption = {
  value: string;
  label_en?: string | null;
  label_ar?: string | null;
};

export type FilterState = {
  nationality: string[];
  gender: string | null;
  ageRange: [number, number];
  jobType: string[];
  salaryRange: [number, number];
  experience: string | null;
  serviceType: string[];
};

export type FilterOptions = {
  nationalities: FilterOption[];
  jobTypes: FilterOption[];
  genders: FilterOption[];
  experienceRanges: FilterOption[];
  serviceTypes: FilterOption[];
};

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  options: FilterOptions;
  loading?: boolean;
};

export default function CVFilterPanel({ filters, setFilters, options, loading }: Props) {
  const t = useTranslations('requestCV.filters');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const labelOf = (opt: FilterOption) =>
    (isAr ? opt.label_ar || opt.label_en : opt.label_en || opt.label_ar) || opt.value;

  const toggleNationality = (code: string) => {
    setFilters((prev) => ({
      ...prev,
      nationality: prev.nationality.includes(code)
        ? prev.nationality.filter((n) => n !== code)
        : [...prev.nationality, code],
    }));
  };

  const toggleJobType = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(key)
        ? prev.jobType.filter((j) => j !== key)
        : [...prev.jobType, key],
    }));
  };

  const toggleServiceType = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      serviceType: prev.serviceType.includes(key)
        ? prev.serviceType.filter((v) => v !== key)
        : [...prev.serviceType, key],
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

  const browseExperience = options.experienceRanges.filter((r) =>
    ['fresh', 'experienced', 'ex_abroad', 'with_experience'].includes(r.value),
  );
  const experienceOptions =
    browseExperience.length > 0 ? browseExperience : options.experienceRanges;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:flex lg:flex-col lg:max-h-[calc(100vh-6.5rem)]">
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

      <div className="hidden lg:flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0 border-b border-gray-100">
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

      <div className={`p-5 ${isMobileOpen ? 'block' : 'hidden lg:block'} lg:overflow-y-auto lg:flex-1`}>
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

        {loading ? (
          <p className="text-sm text-gray-400">{isAr ? 'جاري التحميل…' : 'Loading filters…'}</p>
        ) : (
          <div className="space-y-6">
            {options.nationalities.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-3">{t('nationality')}</h4>
                <div className="flex flex-wrap gap-2">
                  {options.nationalities.map((nat) => (
                    <button
                      key={nat.value}
                      type="button"
                      onClick={() => toggleNationality(nat.value)}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 border ${
                        filters.nationality.includes(nat.value)
                          ? 'bg-brand-orange/10 border-brand-orange text-brand-orange-dark shadow-sm shadow-orange-200'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:bg-brand-orange/5 hover:text-brand-orange hover:shadow-md hover:shadow-orange-100 hover:-translate-y-0.5'
                      }`}
                    >
                      {labelOf(nat)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {options.jobTypes.length > 0 && (
              <>
                <div className="h-px bg-gray-100" />
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">{t('jobType')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {options.jobTypes.map((job) => (
                      <button
                        key={job.value}
                        type="button"
                        onClick={() => toggleJobType(job.value)}
                        className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 border ${
                          filters.jobType.includes(job.value)
                            ? 'bg-brand-orange border-brand-orange text-white shadow-md shadow-orange-200'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-brand-orange/50 hover:bg-brand-orange/5 hover:text-brand-orange hover:shadow-md hover:shadow-orange-100 hover:-translate-y-0.5'
                        }`}
                      >
                        {labelOf(job)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {options.genders.length > 0 && (
              <>
                <div className="h-px bg-gray-100" />
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">{t('gender')}</h4>
                  <div className="flex gap-2">
                    {options.genders.map((g) => {
                      const active = filters.gender === g.value;
                      const female = g.value === 'female';
                      return (
                        <button
                          key={g.value}
                          type="button"
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              gender: prev.gender === g.value ? null : g.value,
                            }))
                          }
                          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                            active
                              ? female
                                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm shadow-rose-100'
                                : 'bg-sky-50 border-sky-200 text-sky-700 shadow-sm shadow-sky-100'
                              : female
                                ? 'bg-white border-gray-200 text-gray-600 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 hover:-translate-y-0.5 hover:shadow-md hover:shadow-rose-100'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-600 hover:-translate-y-0.5 hover:shadow-md hover:shadow-sky-100'
                          }`}
                        >
                          {labelOf(g)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {experienceOptions.length > 0 && (
              <>
                <div className="h-px bg-gray-100" />
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">{t('experience')}</h4>
                  <div className="flex flex-col gap-2">
                    {experienceOptions.map((range) => (
                      <label key={range.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input
                            type="radio"
                            name="experience"
                            checked={filters.experience === range.value}
                            onChange={() =>
                              setFilters((prev) => ({
                                ...prev,
                                experience: prev.experience === range.value ? null : range.value,
                              }))
                            }
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-brand-orange transition-colors" />
                          <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-orange scale-0 peer-checked:scale-100 transition-transform" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          {labelOf(range)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {options.serviceTypes.length > 0 && (
              <>
                <div className="h-px bg-gray-100" />
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">{t('serviceType')}</h4>
                  <div className="flex flex-col gap-2">
                    {options.serviceTypes.map((svc) => (
                      <label key={svc.value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center w-5 h-5">
                          <input
                            type="checkbox"
                            checked={filters.serviceType.includes(svc.value)}
                            onChange={() => toggleServiceType(svc.value)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 rounded border-2 border-gray-300 peer-checked:border-brand-orange peer-checked:bg-brand-orange transition-colors flex items-center justify-center">
                            <svg
                              className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          {labelOf(svc)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
