'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LayoutGrid, AlignJustify } from 'lucide-react';
import { mockWorkers, WorkerCV } from '@/data/cvData';
import CVFilterPanel, { FilterState } from './CVFilterPanel';
import CVGallery from './CVGallery';
import CVDetailModal from './CVDetailModal';
import CVActionSelection from './CVActionSelection';
import DocumentUploadWizard from './DocumentUploadWizard';
import SpecialistBar from './SpecialistBar';

export type FlowState = 'browsing' | 'viewing' | 'action' | 'upload' | 'success';

export default function CVBrowser() {
  const t = useTranslations('requestCV');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [flowState, setFlowState] = useState<FlowState>('browsing');
  const [selectedCV, setSelectedCV] = useState<WorkerCV | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [filters, setFilters] = useState<FilterState>({
    nationality: [],
    gender: null,
    ageRange: [20, 55],
    jobType: [],
    salaryRange: [1000, 5000],
    experience: null,
    visaType: [],
  });

  // Filter logic
  const filteredWorkers = mockWorkers.filter((worker) => {
    // Nationality
    if (filters.nationality.length > 0 && !filters.nationality.includes(worker.nationality)) return false;
    // Gender
    if (filters.gender && worker.gender !== filters.gender) return false;
    // Age
    if (worker.age < filters.ageRange[0] || worker.age > filters.ageRange[1]) return false;
    // Job Type
    if (filters.jobType.length > 0 && !filters.jobType.includes(worker.jobType)) return false;
    // Salary
    if (worker.salaryExpectation < filters.salaryRange[0] || worker.salaryExpectation > filters.salaryRange[1]) return false;
    // Experience
    if (filters.experience) {
      const [min, max] = filters.experience.split('-').map(Number);
      if (max) {
        if (worker.experience < min || worker.experience > max) return false;
      } else {
        // e.g. "10+"
        if (worker.experience < parseInt(filters.experience)) return false;
      }
    }
    // Visa Type
    if (filters.visaType.length > 0 && !filters.visaType.includes(worker.visaType)) return false;

    return true;
  });

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
    <div className="min-h-screen bg-gray-50 pt-20 pb-32 relative">

      {/* Header section */}
      <div className="bg-white border-b border-gray-200 py-8 mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-black text-brand-dark mb-2">{t('title')}</h1>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <CVFilterPanel filters={filters} setFilters={setFilters} />
          </div>

          {/* Gallery Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-semibold text-gray-500">
                {t('gallery.showing', { count: filteredWorkers.length })}
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
            <CVGallery workers={filteredWorkers} onSelect={handleSelectWorker} viewMode={viewMode} />
          </div>
        </div>
      </div>

      {/* Specialist Consultation Sticky Bar */}
      {/* <SpecialistBar /> */}

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
