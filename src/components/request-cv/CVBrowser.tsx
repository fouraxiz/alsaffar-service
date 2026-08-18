'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, AlignJustify } from 'lucide-react';
import { WorkerCV, NATIONALITIES_LIST, JOB_TYPES, SERVICE_TYPES, EXPERIENCE_RANGES } from '@/data/cvData';
import CVFilterPanel, { FilterState, FilterOptions, DEFAULT_AGE_RANGE, DEFAULT_SALARY_RANGE, hasActiveFilters } from './CVFilterPanel';
import CVGallery from './CVGallery';
import CVGallerySkeleton from './CVGallerySkeleton';
import CVDetailModal from './CVDetailModal';
import CVActionSelection from './CVActionSelection';
import DocumentUploadWizard from './DocumentUploadWizard';
import NoMatchForm from './NoMatchForm';
import PageBanner from '@/components/shared/PageBanner';

export type FlowState = 'browsing' | 'viewing' | 'action' | 'upload' | 'success';

/** Always keep the previous filter chips available (ERP + static fallback). */
const FALLBACK_FILTER_OPTIONS: FilterOptions = {
  nationalities: NATIONALITIES_LIST.map((n) => ({
    value: n.code,
    label_en: n.en,
    label_ar: n.ar,
  })),
  jobTypes: JOB_TYPES.map((j) => ({
    value: j.key,
    label_en: j.en,
    label_ar: j.ar,
  })),
  genders: [
    { value: 'female', label_en: 'Female', label_ar: 'أنثى' },
    { value: 'male', label_en: 'Male', label_ar: 'ذكر' },
  ],
  experienceRanges: EXPERIENCE_RANGES.map((e) => ({
    value: e.key,
    label_en: e.en,
    label_ar: e.ar,
  })),
  serviceTypes: SERVICE_TYPES.map((s) => ({
    value: s.key,
    label_en: s.en,
    label_ar: s.ar,
  })),
};

function withFilterFallbacks(partial: Partial<FilterOptions>): FilterOptions {
  return {
    nationalities:
      partial.nationalities && partial.nationalities.length > 0
        ? partial.nationalities
        : FALLBACK_FILTER_OPTIONS.nationalities,
    jobTypes:
      partial.jobTypes && partial.jobTypes.length > 0
        ? partial.jobTypes
        : FALLBACK_FILTER_OPTIONS.jobTypes,
    genders:
      partial.genders && partial.genders.length > 0
        ? partial.genders
        : FALLBACK_FILTER_OPTIONS.genders,
    experienceRanges:
      partial.experienceRanges && partial.experienceRanges.length > 0
        ? partial.experienceRanges
        : FALLBACK_FILTER_OPTIONS.experienceRanges,
    serviceTypes:
      partial.serviceTypes && partial.serviceTypes.length > 0
        ? partial.serviceTypes
        : FALLBACK_FILTER_OPTIONS.serviceTypes,
  };
}

export default function CVBrowser() {
  const t = useTranslations('requestCV');
  const locale = useLocale();

  const [flowState, setFlowState] = useState<FlowState>('browsing');
  const [selectedCV, setSelectedCV] = useState<WorkerCV | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [skippedFilterKey, setSkippedFilterKey] = useState<string | null>(null);

  // Worker CVs come from the live ERP feed via our /api/workers route handler
  // (token stays server-side). `null` = still loading.
  const [workers, setWorkers] = useState<WorkerCV[] | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(FALLBACK_FILTER_OPTIONS);
  const [filtersLoading, setFiltersLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/workers', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active) setWorkers((data?.workers as WorkerCV[]) ?? []);
      })
      .catch(() => {
        if (active) setWorkers([]);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/lookups', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active) return;
        if (!data) {
          setFilterOptions(FALLBACK_FILTER_OPTIONS);
          return;
        }
        setFilterOptions(
          withFilterFallbacks({
            nationalities: (data.countries ?? [])
              .map(
                (c: {
                  value?: string;
                  code?: string;
                  iso2?: string;
                  label_en?: string;
                  label_ar?: string;
                  nationality_label?: string;
                  name?: string;
                  name_ar?: string;
                }) => ({
                  value: String(c.value || c.code || c.iso2 || '').toLowerCase(),
                  label_en: c.label_en || c.nationality_label || c.name || null,
                  label_ar: c.label_ar || c.name_ar || c.label_en || c.name || null,
                }),
              )
              .filter((c: { value: string }) => !!c.value),
            jobTypes: (data.categories ?? [])
              .map(
                (j: {
                  value?: string;
                  slug?: string;
                  label_en?: string;
                  label_ar?: string;
                  name?: string;
                  name_ar?: string;
                }) => ({
                  value: String(j.value || j.slug || '').toLowerCase(),
                  label_en: j.label_en || j.name || null,
                  label_ar: j.label_ar || j.name_ar || j.label_en || j.name || null,
                }),
              )
              .filter((j: { value: string }) => !!j.value),
            genders: (data.genders ?? [])
              .map((g: { value?: string; label_en?: string; label_ar?: string }) => ({
                value: String(g.value || ''),
                label_en: g.label_en || null,
                label_ar: g.label_ar || g.label_en || null,
              }))
              .filter((g: { value: string }) => !!g.value),
            experienceRanges: (data.experience_ranges ?? [])
              .map((e: { value?: string; label_en?: string; label_ar?: string }) => ({
                value: String(e.value || ''),
                label_en: e.label_en || null,
                label_ar: e.label_ar || e.label_en || null,
              }))
              .filter((e: { value: string }) => !!e.value),
            serviceTypes: (data.service_types ?? [])
              .map((s: { value?: string; label_en?: string; label_ar?: string }) => ({
                value: String(s.value || ''),
                label_en: s.label_en || null,
                label_ar: s.label_ar || s.label_en || null,
              }))
              .filter((s: { value: string }) => !!s.value),
          }),
        );
      })
      .catch(() => {
        if (active) setFilterOptions(FALLBACK_FILTER_OPTIONS);
      })
      .finally(() => {
        if (active) setFiltersLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const isLoading = workers === null;

  const [filters, setFilters] = useState<FilterState>({
    nationality: [],
    gender: null,
    ageRange: DEFAULT_AGE_RANGE,
    jobType: [],
    salaryRange: DEFAULT_SALARY_RANGE,
    experience: null,
    serviceType: [],
  });

  const filteredWorkers = (workers ?? []).filter((worker) => {
    if (filters.nationality.length > 0 && !filters.nationality.includes(worker.nationality)) return false;
    if (filters.gender && worker.gender !== filters.gender) return false;
    if (worker.age > 0 && (worker.age < filters.ageRange[0] || worker.age > filters.ageRange[1])) return false;
    if (filters.jobType.length > 0 && !filters.jobType.includes(worker.jobType)) return false;
    if (
      worker.salaryExpectation > 0 &&
      (worker.salaryExpectation < filters.salaryRange[0] || worker.salaryExpectation > filters.salaryRange[1])
    ) {
      return false;
    }
    if (filters.experience) {
      if (filters.experience === 'fresh' || filters.experience === '0-1') {
        if (worker.experience > 2) return false;
      } else if (
        filters.experience === 'experienced' ||
        filters.experience === 'ex_abroad' ||
        filters.experience === 'with_experience' ||
        filters.experience === '5+'
      ) {
        if (worker.experience <= 2) return false;
      } else if (filters.experience === '1-3') {
        if (worker.experience < 1 || worker.experience > 3) return false;
      } else if (filters.experience === '3-5') {
        if (worker.experience < 3 || worker.experience > 5) return false;
      }
    }
    // Only apply when the worker actually has a backend service type.
    if (
      filters.serviceType.length > 0 &&
      worker.serviceType &&
      !filters.serviceType.includes(worker.serviceType)
    ) {
      return false;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSkippedFilterKey(null);
    setShowRequestForm(false);
    setFilters({
      nationality: [],
      gender: null,
      ageRange: DEFAULT_AGE_RANGE,
      jobType: [],
      salaryRange: [...DEFAULT_SALARY_RANGE],
      experience: null,
      serviceType: [],
    });
  };

  const filterKey = useMemo(() => JSON.stringify(filters), [filters]);
  const outOfScope = !isLoading && filteredWorkers.length === 0 && hasActiveFilters(filters);

  // Out-of-scope filters: auto-open the mandatory lead form so the team can follow up.
  useEffect(() => {
    if (!outOfScope) {
      setShowRequestForm(false);
      return;
    }
    if (skippedFilterKey === filterKey) return;
    const timer = window.setTimeout(() => setShowRequestForm(true), 450);
    return () => window.clearTimeout(timer);
  }, [outOfScope, filterKey, skippedFilterKey]);

  // Handlers
  const handleSelectWorker = (worker: WorkerCV) => {
    setSelectedCV(worker);
    setFlowState('viewing');
  };

  const handleCloseModal = () => {
    setSelectedCV(null);
    setFlowState('browsing');
  };

  const handleProceedToAction = () => {
    setFlowState('action');
  };

  const handleBackToAction = () => {
    setFlowState('action');
  };

  const handleBackToViewing = () => {
    setFlowState('viewing');
  };

  const handleContinueToUpload = () => {
    setFlowState('upload');
  };

  const handleUploadComplete = () => {
    setFlowState('success');
  };

  return (
    <div className="min-h-screen bg-transparent pb-16 relative">
      <PageBanner
        title={t('title')}
        subtitle={t('subtitle')}
        badgeText={locale === 'ar' ? 'تصفح السير الذاتية' : 'Discover Talent'}
        iconType="cv"
      />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
            <CVFilterPanel
              filters={filters}
              setFilters={setFilters}
              options={filterOptions}
              loading={filtersLoading}
            />
          </div>

          {/* Gallery Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-500">
                {isLoading
                  ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange/70" />
                      {locale === 'ar' ? 'جاري التحميل…' : 'Loading…'}
                    </span>
                  )
                  : t('gallery.showing', { count: filteredWorkers.length })}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('list')}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors border ${viewMode === 'list' ? 'bg-sky-400 border-sky-400 text-white shadow-md shadow-sky-200' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  aria-label="List View"
                >
                  <AlignJustify size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors border ${viewMode === 'grid' ? 'bg-sky-400 border-sky-400 text-white shadow-md shadow-sky-200' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                  aria-label="Grid View"
                >
                  <LayoutGrid size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            {isLoading ? (
              <CVGallerySkeleton viewMode={viewMode} />
            ) : filteredWorkers.length > 0 ? (
              <CVGallery workers={filteredWorkers} onSelect={handleSelectWorker} viewMode={viewMode} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-lg font-bold text-brand-dark mb-2">{t('gallery.noResults')}</p>
                <p className="text-gray-500 mb-6">{t('gallery.tryAdjusting')}</p>
                {hasActiveFilters(filters) && (
                  <button
                    onClick={() => {
                      setSkippedFilterKey(null);
                      setShowRequestForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    {t('noMatch.title')}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRequestForm && (
        <NoMatchForm
          filters={filters}
          options={filterOptions}
          onClose={handleClearFilters}
          onAdjustFilters={() => {
            setSkippedFilterKey(filterKey);
            setShowRequestForm(false);
          }}
        />
      )}

      {/* Modals & Overlays */}
      {flowState === 'viewing' && selectedCV && (
        <CVDetailModal
          worker={selectedCV}
          onClose={handleCloseModal}
          onProceed={handleProceedToAction}
        />
      )}

      {flowState === 'action' && selectedCV && (
        <CVActionSelection
          worker={selectedCV}
          onClose={() => setFlowState('browsing')}
          onBack={handleBackToViewing}
          onContinue={handleContinueToUpload}
        />
      )}

      {flowState === 'upload' && selectedCV && (
        <DocumentUploadWizard
          worker={selectedCV}
          onClose={() => setFlowState('browsing')}
          onBack={handleBackToAction}
          onComplete={handleUploadComplete}
        />
      )}

      {flowState === 'success' && selectedCV && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-brand-dark mb-3">{t('upload.successTitle')}</h3>
            <p className="text-gray-500 leading-relaxed mb-8">{t('upload.successDesc')}</p>
            <button
              onClick={handleCloseModal}
              className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white py-4 rounded-xl font-bold text-lg transition-colors"
            >
              {t('detail.backToBrowse')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
