'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { WorkerCV } from '@/data/cvData';
import { ArrowLeft, ArrowRight, UploadCloud, File, X, CheckCircle2 } from 'lucide-react';
import WorkerPhoto from './WorkerPhoto';

type Props = {
  worker: WorkerCV;
  onClose: () => void;
  onBack: () => void;
  onComplete: () => void;
};

export default function DocumentUploadWizard({ worker, onClose, onBack, onComplete }: Props) {
  const t = useTranslations('requestCV.upload');
  const tActions = useTranslations('requestCV.actions');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
  });

  const [files, setFiles] = useState<{ visa: File | null; id: File | null }>({
    visa: null,
    id: null,
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => {
    if (step === 1) onBack();
    else setStep(s => Math.max(s - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'visa' | 'id') => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files![0] }));
    }
  };

  const removeFile = (type: 'visa' | 'id') => {
    setFiles(prev => ({ ...prev, [type]: null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1500);
  };

  const FileUploadArea = ({ type, label }: { type: 'visa' | 'id', label: string }) => {
    const file = files[type];
    return (
      <div className="mb-5">
        <label className="block text-sm font-bold text-gray-700 mb-2">{label} <span className="text-rose-500">*</span></label>
        {file ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <File size={20} className="text-green-500" />
              </div>
              <div className="truncate">
                <div className="text-sm font-bold text-gray-900 truncate">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            </div>
            <button 
              type="button" 
              onClick={() => removeFile(type)}
              className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-brand-orange hover:bg-orange-50 transition-colors group cursor-pointer">
            <input 
              type="file" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange(e, type)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-brand-orange/10 text-gray-400 group-hover:text-brand-orange rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
              <UploadCloud size={24} />
            </div>
            <p className="text-sm font-semibold text-brand-dark mb-1">{t('dragDrop')}</p>
            <p className="text-xs text-gray-500">{t('acceptedFormats')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in h-[90vh] sm:h-auto" dir={isAr ? 'rtl' : 'ltr'}>
        
        {/* Header Area */}
        <div className="bg-gray-50 border-b border-gray-100">
          <div className="px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-brand-dark">{tActions('continue')}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
              <X size={18} />
            </button>
          </div>
          
          {/* Worker summary mini-card */}
          <div className="px-6 pb-4 flex items-center gap-4">
            <div className="w-12 h-12 relative rounded-xl overflow-hidden shrink-0 shadow-sm">
              <WorkerPhoto src={worker.photoUrl} alt="Worker" className="object-cover" iconSize={24} sizes="48px" />
            </div>
            <div>
              <div className="font-bold text-brand-dark leading-tight">{isAr ? worker.nameAr : worker.name}</div>
              <div className="text-xs text-gray-500">{isAr ? worker.jobTypeAr : worker.jobType} · {worker.id}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-5">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-1/2"></div>
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-brand-orange -z-10 -translate-y-1/2 transition-all duration-300" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
              
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step >= i ? 'bg-brand-orange text-white ring-4 ring-orange-50' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > i ? <CheckCircle2 size={12} /> : i}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${step >= i ? 'text-brand-orange' : 'text-gray-400'}`}>
                    {i === 1 ? t('step1') : i === 2 ? t('step2') : t('step3')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1">
            
            {/* Step 1: Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('fullName')} <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" required
                    value={formData.fullName}
                    onChange={e => setFormData(p => ({...p, fullName: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('phone')} <span className="text-rose-500">*</span></label>
                  <input 
                    type="tel" required dir="ltr"
                    value={formData.phone}
                    onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('email')}</label>
                  <input 
                    type="email" dir="ltr"
                    value={formData.email}
                    onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('city')} <span className="text-rose-500">*</span></label>
                  <select 
                    required
                    value={formData.city}
                    onChange={e => setFormData(p => ({...p, city: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:bg-white outline-none transition-all appearance-none"
                  >
                    <option value="">{isAr ? 'اختر المدينة' : 'Select City'}</option>
                    <option value="riyadh">{isAr ? 'الرياض' : 'Riyadh'}</option>
                    <option value="jeddah">{isAr ? 'جدة' : 'Jeddah'}</option>
                    <option value="dammam">{isAr ? 'الدمام' : 'Dammam'}</option>
                    <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('address')} <span className="text-rose-500">*</span></label>
                  <textarea 
                    required rows={2}
                    value={formData.address}
                    onChange={e => setFormData(p => ({...p, address: e.target.value}))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-orange focus:ring-1 focus:ring-brand-orange focus:bg-white outline-none transition-all resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Documents */}
            {step === 2 && (
              <div className="animate-fade-in">
                <FileUploadArea type="visa" label={t('visaCopy')} />
                <FileUploadArea type="id" label={t('idCopy')} />
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                {/* Summary Box */}
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-2">
                  <div className="text-sm font-bold text-brand-dark mb-4">{isAr ? 'ملخص الطلب' : 'Request Summary'}</div>
                  <ul className="text-sm text-gray-700 space-y-3">
                    <li className="flex justify-between items-center pb-2 border-b border-orange-100/50">
                      <span className="text-gray-500">{isAr ? 'المرشح' : 'Candidate'}:</span> 
                      <span className="font-bold">{isAr ? worker.nameAr : worker.name}</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-orange-100/50">
                      <span className="text-gray-500">{isAr ? 'الاسم' : 'Name'}:</span> 
                      <span className="font-bold">{formData.fullName}</span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-orange-100/50">
                      <span className="text-gray-500">{isAr ? 'المدينة' : 'City'}:</span> 
                      <span className="font-bold capitalize">{formData.city}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-500">{isAr ? 'مستندات' : 'Documents'}:</span> 
                      <span className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={16} />
                        2 {isAr ? 'مرفق' : 'Attached'}
                      </span>
                    </li>
                  </ul>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed text-center mt-4">
                  {isAr 
                    ? 'يرجى مراجعة تفاصيل طلبك والمستندات المرفقة قبل الإرسال النهائي.' 
                    : 'Please review your request details and attached documents before final submission.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-6 border-t border-gray-100 bg-white flex gap-3 mt-auto">
            <button 
              type="button" 
              onClick={handlePrev}
              className="px-6 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {t('back')}
            </button>
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={handleNext}
                disabled={step === 2 && (!files.visa || !files.id)}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-brand-dark hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('next')}
              </button>
            ) : (
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-brand-orange hover:bg-brand-orange-dark shadow-md shadow-orange-200 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : t('submit')}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
