'use client';

import { useTranslations, useLocale } from 'next-intl';
import { WorkerCV } from '@/data/cvData';
import { Play } from 'lucide-react';
import WorkerPhoto from './WorkerPhoto';

type Props = {
  workers: WorkerCV[];
  onSelect: (worker: WorkerCV) => void;
  viewMode?: 'grid' | 'list';
};

const categoryColors: Record<string, string> = {
  housemaid: 'bg-rose-100 text-rose-700',
  nanny: 'bg-rose-100 text-rose-700',
  elderly_care: 'bg-rose-100 text-rose-700',
  cook: 'bg-amber-100 text-amber-700',
  driver: 'bg-sky-100 text-sky-700',
  cleaner: 'bg-emerald-100 text-emerald-700',
  technician: 'bg-indigo-100 text-indigo-700',
  electrician: 'bg-indigo-100 text-indigo-700',
  plumber: 'bg-indigo-100 text-indigo-700',
  gardener: 'bg-lime-100 text-lime-700',
};

export default function CVGallery({ workers, onSelect, viewMode = 'grid' }: Props) {
  const t = useTranslations('requestCV.gallery');
  const locale = useLocale();
  const isAr = locale === 'ar';

  if (workers.length === 0) {
    return null; // Empty state is handled by NoMatchForm in parent
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {workers.map((worker) => (
          <div
            key={worker.id}
            onClick={() => onSelect(worker)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col sm:flex-row h-auto"
          >
            {/* Photo Section */}
            <div className="relative w-full sm:w-48 aspect-[4/3] sm:aspect-square bg-gray-100 overflow-hidden shrink-0">
              <WorkerPhoto
                src={worker.photoUrl}
                alt={isAr ? worker.nameAr : worker.name}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                iconSize={48}
              />

              <div className="absolute top-3 start-3 shadow-sm bg-white p-1 rounded">
                <div className="relative w-7 h-5 rounded-sm overflow-hidden flex items-center justify-center bg-gray-50">
                  <img
                    src={`https://flagcdn.com/w40/${worker.nationality}.png`}
                    alt={isAr ? worker.nationalityNameAr : worker.nationalityNameEn}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Video Indicator */}
              {worker.hasVideo && (
                <div className="absolute top-3 end-3 bg-brand-dark/80 backdrop-blur-sm text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm">
                  <Play size={10} fill="currentColor" />
                  VIDEO
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-4 sm:p-6 flex flex-col flex-1 justify-between">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-brand-dark text-lg sm:text-xl leading-tight mb-1 line-clamp-1 group-hover:text-brand-orange transition-colors">
                    {isAr ? worker.nameAr : worker.name}
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-500 font-medium">
                    {isAr ? worker.nationalityNameAr : worker.nationalityNameEn}
                  </div>
                </div>
                <div className={`self-start text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${categoryColors[worker.jobType] || 'bg-gray-100 text-gray-600'}`}>
                  {isAr ? worker.jobTypeAr : worker.jobType}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Age</div>
                  <div className="text-sm font-semibold text-brand-dark">{worker.age}</div>
                </div>
                <div className="w-px h-6 bg-gray-100 hidden sm:block" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Exp</div>
                  <div className="text-sm font-semibold text-brand-dark">{worker.experience}y</div>
                </div>
                <div className="w-px h-6 bg-gray-100 hidden sm:block" />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold">Salary</div>
                  <div className="text-sm font-bold text-brand-orange">{worker.salaryExpectation}</div>
                </div>

                <div className="w-full sm:w-auto mt-2 sm:mt-0 sm:ms-auto">
                  <div className="w-full sm:w-auto bg-gray-50 group-hover:bg-brand-orange text-gray-600 group-hover:text-white px-4 py-2 rounded-lg flex items-center justify-center text-sm font-bold transition-colors">
                    {t('viewFullCV')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {workers.map((worker) => (
        <div
          key={worker.id}
          onClick={() => onSelect(worker)}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full"
        >
          {/* Photo Section */}
          <div className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden">
            <WorkerPhoto
              src={worker.photoUrl}
              alt={isAr ? worker.nameAr : worker.name}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              iconSize={48}
            />

            {/* Nationality Flag Badge */}
            <div className="absolute top-3 start-3 shadow-sm bg-white p-1 rounded">
              <div className="relative w-7 h-5 rounded-sm overflow-hidden flex items-center justify-center bg-gray-50">
                <img
                  src={`https://flagcdn.com/w40/${worker.nationality}.png`}
                  alt={isAr ? worker.nationalityNameAr : worker.nationalityNameEn}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Video Indicator */}
            {worker.hasVideo && (
              <div className="absolute top-3 end-3 bg-brand-dark/80 backdrop-blur-sm text-white px-2 py-1 rounded flex items-center gap-1 text-[10px] font-bold shadow-sm">
                <Play size={10} fill="currentColor" />
                VIDEO
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-4 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-brand-dark text-lg leading-tight mb-1 line-clamp-1">
                  {isAr ? worker.nameAr : worker.name}
                </h3>
                <div className="text-xs text-gray-500 font-medium">
                  {isAr ? worker.nationalityNameAr : worker.nationalityNameEn}
                </div>
              </div>
              <div className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider whitespace-nowrap ${categoryColors[worker.jobType] || 'bg-gray-100 text-gray-600'}`}>
                {isAr ? worker.jobTypeAr : worker.jobType}
              </div>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Age</div>
                <div className="text-sm font-semibold text-brand-dark">{worker.age}</div>
              </div>
              <div className="w-px h-6 bg-gray-100" />
              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Exp</div>
                <div className="text-sm font-semibold text-brand-dark">{worker.experience}y</div>
              </div>
              <div className="w-px h-6 bg-gray-100" />
              <div className="text-center">
                <div className="text-[10px] text-gray-400 uppercase font-bold">Salary</div>
                <div className="text-sm font-bold text-brand-orange">{worker.salaryExpectation}</div>
              </div>
            </div>

            {/* View Full Button (visible on hover for desktop, always on for touch) */}
            <div className="mt-4 overflow-hidden h-0 group-hover:h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
              <div className="w-full h-full bg-brand-orange text-white rounded-lg flex items-center justify-center text-sm font-bold shadow-md shadow-orange-100">
                {t('viewFullCV')}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
