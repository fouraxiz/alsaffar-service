'use client';

import { useState } from 'react';

import { useTranslations, useLocale } from 'next-intl';
import { WorkerCV } from '@/data/cvData';
import { X, Download, PlayCircle, CheckCircle2, LogIn } from 'lucide-react';
import WorkerPhoto from './WorkerPhoto';
import { usePortalUrl } from '@/components/site/PortalUrlProvider';
import { portalAuthUrl } from '@/lib/portalUrl';

type Props = {
  worker: WorkerCV;
  onClose: () => void;
  onProceed: () => void;
};

export default function CVDetailModal({ worker, onClose }: Props) {
  const t = useTranslations('requestCV.detail');
  const locale = useLocale();
  const isAr = locale === 'ar';
  const portalUrl = usePortalUrl();

  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);

  const customerLoginUrl = portalAuthUrl(portalUrl, 'login', 'customer');

  /** Public site has no customer session — require ERP customer login first. */
  const requireCustomerLogin = () => {
    setShowLoginGate(true);
  };

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header / Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col md:flex-row h-full overflow-y-auto bg-white">
          {/* Left Panel: Media */}
          <div className="w-full md:w-2/5 bg-gray-50 flex flex-col">
            <div className="relative aspect-[3/4] w-full bg-black">
              {isPlayingVideo ? (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/QPvWOFs878Y?list=PLqlYvGeCJum89IctZH3SVauxehGeN0HPn&index=3&autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <WorkerPhoto
                    src={worker.photoUrl}
                    alt={isAr ? worker.nameAr : worker.name}
                    className="object-cover"
                    iconSize={64}
                  />

                  {/* Video Overlay if available */}
                  {worker.hasVideo && (
                    <div
                      onClick={() => setIsPlayingVideo(true)}
                      className="absolute inset-0 bg-black/20 flex items-center justify-center group cursor-pointer hover:bg-black/40 transition-colors print:hidden"
                    >
                      <div className="flex flex-col items-center gap-2 text-white">
                        <PlayCircle size={48} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-sm tracking-wide bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                          {t('videoAvailable')}
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="p-4 md:p-6 mt-auto print:hidden">
              <button
                type="button"
                onClick={() => requireCustomerLogin()}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-brand-orange text-brand-orange hover:bg-orange-50 py-3 rounded-xl font-bold transition-colors">
                <Download size={18} />
                {t('downloadPDF')}
              </button>
            </div>
          </div>

          {/* Right Panel: Details */}
          <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">

            {/* Title & Badge */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-brand-dark mb-1">
                  {isAr ? worker.nameAr : worker.name}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 font-medium">
                  <div className="w-5 h-3.5 relative rounded-sm overflow-hidden flex items-center justify-center bg-gray-50">
                    <img
                      src={`https://flagcdn.com/w40/${worker.nationality}.png`}
                      alt={isAr ? worker.nationalityNameAr : worker.nationalityNameEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isAr ? worker.nationalityNameAr : worker.nationalityNameEn}
                </div>
              </div>
              <div className="bg-orange-100 text-brand-orange text-sm font-bold px-3 py-1.5 rounded uppercase tracking-wider">
                {isAr ? worker.jobTypeAr : worker.jobType}
              </div>
            </div>

            {/* Key Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="text-center">
                <div className="text-xl font-black text-brand-dark">{worker.age}</div>
                <div className="text-[11px] text-gray-400 font-bold uppercase">{t('age')}</div>
              </div>
              <div className="text-center border-x border-gray-200">
                <div className="text-xl font-black text-brand-dark">{worker.experience}</div>
                <div className="text-[11px] text-gray-400 font-bold uppercase">{t('experience')}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-black text-brand-orange">{worker.salaryExpectation}</div>
                <div className="text-[11px] text-brand-orange/60 font-bold uppercase">{t('salary')}</div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-900 mb-2">{t('about')}</h4>
              <p className="text-gray-600 leading-relaxed text-sm">
                {isAr ? worker.bioAr : worker.bio}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6">
              <div>
                <div className="text-[11px] text-gray-400 font-bold uppercase mb-1">{t('religion')}</div>
                <div className="text-sm font-semibold text-gray-900">{isAr ? worker.religionAr : worker.religion}</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400 font-bold uppercase mb-1">{t('maritalStatus')}</div>
                <div className="text-sm font-semibold text-gray-900">{isAr ? worker.maritalStatusAr : worker.maritalStatus}</div>
              </div>
              <div className="col-span-2">
                <div className="text-[11px] text-gray-400 font-bold uppercase mb-1">{t('languages')}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(isAr ? worker.languagesAr : worker.languages).map(lang => (
                    <span key={lang} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-md font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-gray-900 mb-3">{t('skills')}</h4>
              <div className="flex flex-wrap gap-2">
                {(isAr ? worker.skillsAr : worker.skills).map(skill => (
                  <div key={skill} className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 print:hidden">
              <button
                type="button"
                onClick={() => requireCustomerLogin()}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-dark text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5"
              >
                {t('selectWorker')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold text-lg transition-colors"
              >
                {t('backToBrowse')}
              </button>
            </div>

          </div>
        </div>

        {/* Login required gate */}
        {showLoginGate && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-brand-dark/50 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-brand-orange">
                <LogIn size={22} />
              </div>
              <h3 className="mb-2 text-lg font-black text-brand-dark">{t('loginRequiredTitle')}</h3>
              <p className="mb-6 text-sm leading-relaxed text-gray-600">{t('loginRequiredMessage')}</p>
              <div className="flex flex-col gap-2">
                <a
                  href={customerLoginUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-orange px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-orange-dark"
                >
                  <LogIn size={16} />
                  {t('loginRequiredCta')}
                </a>
                <button
                  type="button"
                  onClick={() => setShowLoginGate(false)}
                  className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {t('loginRequiredCancel')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
