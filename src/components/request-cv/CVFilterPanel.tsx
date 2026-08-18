'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useCallback, useState } from 'react';

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

export const AGE_MIN = 18;
export const AGE_MAX = 65;
export const DEFAULT_AGE_RANGE: [number, number] = [AGE_MIN, AGE_MAX];
export const DEFAULT_SALARY_RANGE: [number, number] = [1000, 5000];

/** True when the visitor has narrowed the catalog (not just the default ranges). */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.nationality.length > 0 ||
    filters.gender != null ||
    filters.jobType.length > 0 ||
    filters.experience != null ||
    filters.serviceType.length > 0 ||
    filters.ageRange[0] !== DEFAULT_AGE_RANGE[0] ||
    filters.ageRange[1] !== DEFAULT_AGE_RANGE[1]
  );
}

type Props = {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  options: FilterOptions;
  loading?: boolean;
};

function AgeRangeBar({
  value,
  onChange,
  label,
  yearsLabel,
}: {
  value: [number, number];
  onChange: (next: [number, number]) => void;
  label: string;
  yearsLabel: string;
}) {
  const [min, max] = value;
  const span = AGE_MAX - AGE_MIN;

  const setMin = useCallback(
    (raw: number) => {
      const next = Math.min(Math.max(raw, AGE_MIN), max - 1);
      onChange([next, max]);
    },
    [max, onChange],
  );

  const setMax = useCallback(
    (raw: number) => {
      const next = Math.max(Math.min(raw, AGE_MAX), min + 1);
      onChange([min, next]);
    },
    [min, onChange],
  );

  const leftPct = ((min - AGE_MIN) / span) * 100;
  const rightPct = ((max - AGE_MIN) / span) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-bold text-gray-700">{label}</h4>
        <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 text-xs font-bold text-brand-orange">
          {min} – {max} {yearsLabel}
        </span>
      </div>

      <div className="relative h-8 select-none px-1">
        <div className="absolute start-1 end-1 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-brand-orange"
          style={{ insetInlineStart: `${leftPct}%`, width: `${Math.max(rightPct - leftPct, 0)}%` }}
        />

        <input
          type="range"
          min={AGE_MIN}
          max={AGE_MAX}
          step={1}
          value={min}
          aria-label={`${label} min`}
          onChange={(e) => setMin(Number(e.target.value))}
          className="age-range-thumb pointer-events-none absolute inset-x-0 top-0 z-[2] h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
        />
        <input
          type="range"
          min={AGE_MIN}
          max={AGE_MAX}
          step={1}
          value={max}
          aria-label={`${label} max`}
          onChange={(e) => setMax(Number(e.target.value))}
          className="age-range-thumb pointer-events-none absolute inset-x-0 top-0 z-[3] h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
        />
      </div>

      <div className="mt-1 flex justify-between px-0.5 text-[11px] font-semibold text-gray-400">
        <span>{AGE_MIN}</span>
        <span>{AGE_MAX}</span>
      </div>

      <style>{`
        .age-range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #e8870a;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        .age-range-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #e8870a;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
        .age-range-thumb::-webkit-slider-runnable-track {
          background: transparent;
          height: 8px;
        }
        .age-range-thumb::-moz-range-track {
          background: transparent;
          height: 8px;
          border: none;
        }
      `}</style>
    </div>
  );
}

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
      ageRange: DEFAULT_AGE_RANGE,
      jobType: [],
      salaryRange: DEFAULT_SALARY_RANGE,
      experience: null,
      serviceType: [],
    });
  };

  const ageActive =
    filters.ageRange[0] !== DEFAULT_AGE_RANGE[0] || filters.ageRange[1] !== DEFAULT_AGE_RANGE[1];

  const activeFilterCount =
    filters.nationality.length +
    (filters.gender ? 1 : 0) +
    filters.jobType.length +
    (filters.experience ? 1 : 0) +
    filters.serviceType.length +
    (ageActive ? 1 : 0);

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
          <div className="relative overflow-hidden rounded-xl border border-white/60 bg-white/50 p-4 backdrop-blur-md">
            <div className="pointer-events-none absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="relative space-y-5">
              <div>
                <div className="mb-3 h-3 w-24 rounded-full bg-brand-dark/10" />
                <div className="flex flex-wrap gap-2">
                  {[72, 88, 64, 96, 80, 70].map((w, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-full bg-white/70 shadow-sm backdrop-blur-sm"
                      style={{ width: w }}
                    />
                  ))}
                </div>
              </div>
              <div className="h-px bg-white/60" />
              <div>
                <div className="mb-3 h-3 w-20 rounded-full bg-brand-dark/10" />
                <div className="h-8 rounded-full bg-white/70" />
              </div>
            </div>
          </div>
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

            <div className="h-px bg-gray-100" />
            <AgeRangeBar
              value={filters.ageRange}
              onChange={(ageRange) => setFilters((prev) => ({ ...prev, ageRange }))}
              label={t('age')}
              yearsLabel={t('years')}
            />

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
