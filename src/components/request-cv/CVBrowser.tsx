'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid, AlignJustify } from 'lucide-react';
import { mockWorkers, WorkerCV } from '@/data/cvData';
import CVFilterPanel, { FilterState } from './CVFilterPanel';
import CVGallery from './CVGallery';
import CVDetailModal from './CVDetailModal';
import CVActionSelection from './CVActionSelection';
import DocumentUploadWizard from './DocumentUploadWizard';
import NoMatchForm from './NoMatchForm';

export type FlowState = 'browsing' | 'viewing' | 'action' | 'upload' | 'success';

export default function CVBrowser() {
  const t = useTranslations('requestCV');
  const locale = useLocale();
  const searchParams = useSearchParams();

  const [flowState, setFlowState] = useState<FlowState>('browsing');
  const [selectedCV, setSelectedCV] = useState<WorkerCV | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    nationality: [],
    gender: null,
    ageRange: [20, 55],
    jobType: [],
    salaryRange: [1000, 5000],
    experience: null,
    serviceType: [],
  });

  useEffect(() => {
    const nationalityParam = searchParams.get('nationality');
    const categoryParam = searchParams.get('category');
    
    setFilters(prev => {
      const next = { ...prev };
      
      if (nationalityParam) {
        next.nationality = [nationalityParam];
      }
      
      if (categoryParam) {
        if (categoryParam === 'domestic') {
          next.jobType = ['housemaid', 'nanny', 'cook', 'cleaner', 'elderly_care'];
        } else if (categoryParam === 'driver') {
          next.jobType = ['driver'];
        } else if (categoryParam === 'skilled') {
          next.jobType = ['technician', 'electrician', 'plumber', 'gardener'];
        }
      }
      
      return next;
    });
  }, [searchParams]);

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
      if (filters.experience === 'fresh') {
        if (worker.experience > 2) return false;
      } else if (filters.experience === 'experienced') {
        if (worker.experience <= 2) return false;
      }
    }
    // Service Type
    if (filters.serviceType.length > 0 && !filters.serviceType.includes(worker.serviceType)) return false;

    return true;
  });

  const handleClearFilters = () => {
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

      {/* Creative Header Section */}
      <div className="relative mx-4 lg:mx-auto max-w-7xl mb-12 mt-4 rounded-[2rem] overflow-hidden bg-brand-dark shadow-2xl">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1105] via-[#1a2e12] to-[#0a1105] z-0" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 z-[1] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E8870A]/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 z-[1]" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 z-[2] opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative z-10 px-8 py-12 md:px-16 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md shadow-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping absolute opacity-75" />
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange relative" />
              <span className="text-xs md:text-sm font-bold tracking-widest text-brand-orange uppercase">
                {locale === 'ar' ? 'تصفح السير الذاتية' : 'Discover Talent'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {t('title')}
            </h1>
            <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Decorative 3D Elements Area for Desktop */}
          <div className="hidden lg:flex relative w-72 h-72 justify-center items-center perspective-1000">
            {/* Back Card */}
            <div className="absolute w-48 h-64 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md transform rotate-[-15deg] -translate-x-10 shadow-2xl transition-transform duration-500 hover:rotate-[-20deg] hover:-translate-x-12" />
            
            {/* Front Card */}
            <div className="absolute w-52 h-72 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 backdrop-blur-xl transform rotate-[10deg] translate-x-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col p-6 transition-transform duration-500 hover:rotate-[15deg] hover:translate-x-8 hover:-translate-y-2 group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-orange to-[#ffb84d] mb-6 shadow-[0_0_20px_rgba(232,135,10,0.4)] group-hover:scale-110 transition-transform duration-500 flex-shrink-0" />
              <div className="w-3/4 h-3 bg-white/20 rounded-full mb-3" />
              <div className="w-1/2 h-3 bg-white/10 rounded-full mb-8" />
              
              <div className="mt-auto flex gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="w-8 h-8 rounded-lg bg-brand-orange/80 shadow-lg shadow-orange-500/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-24 lg:self-start">
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
            {filteredWorkers.length > 0 ? (
              <CVGallery workers={filteredWorkers} onSelect={handleSelectWorker} viewMode={viewMode} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <p className="text-lg font-bold text-brand-dark mb-2">{t('gallery.noResults')}</p>
                <p className="text-gray-500 mb-6">{t('gallery.tryAdjusting')}</p>
                <button
                  onClick={() => setShowRequestForm(true)}
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  {t('noMatch.title')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Request-specific-worker form: opens only when the user clicks the button */}
      {showRequestForm && (
        <NoMatchForm
          filters={filters}
          onClose={() => {
            setShowRequestForm(false);
            handleClearFilters();
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
