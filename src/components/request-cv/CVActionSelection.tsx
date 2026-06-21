'use client';

import { useTranslations, useLocale } from 'next-intl';
import { WorkerCV } from '@/data/cvData';
import { Phone, ChevronRight, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import Image from 'next/image';

const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

type Props = {
  worker: WorkerCV;
  onClose: () => void;
  onBack: () => void;
  onContinue: () => void;
};

export default function CVActionSelection({ worker, onClose, onBack, onContinue }: Props) {
  const t = useTranslations('requestCV.actions');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const whatsappMessage = encodeURIComponent(
    isAr 
      ? `مرحباً، أود الاستفسار عن السيرة الذاتية لـ ${worker.nameAr} (رقم المرجع: ${worker.id})`
      : `Hello, I am interested in recruiting ${worker.name} (Ref ID: ${worker.id})`
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-auto">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div 
        className="relative bg-gray-50 w-full max-w-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center border-b border-gray-100">
          <button 
            onClick={onBack}
            className="w-10 h-10 -ms-2 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            {isAr ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
          
          <div className="flex-1 px-4 flex items-center gap-3">
            <div className="w-10 h-10 relative rounded-full overflow-hidden shrink-0 shadow-sm border border-gray-100">
              <Image src={worker.photoUrl} alt="Worker" fill className="object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm text-brand-dark leading-tight">{isAr ? worker.nameAr : worker.name}</div>
              <div className="text-xs text-gray-500">{worker.id}</div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-black text-brand-dark text-center mb-8">
            {t('title')}
          </h2>

          <div className="space-y-4">
            
            {/* WhatsApp - Recommended */}
            <a 
              href={`https://wa.me/966920021201?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block bg-white border-2 border-[#25D366] rounded-2xl p-5 shadow-lg shadow-green-100 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="absolute -top-3 end-6 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {t('recommended')}
              </div>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-green-50 text-[#25D366] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <WhatsAppIcon size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-brand-dark mb-1">{t('whatsapp')}</h3>
                  <p className="text-sm text-gray-500">{t('whatsappDesc')}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-[#25D366] transition-colors rtl:rotate-180" />
              </div>
            </a>

            {/* Call Directly */}
            <a 
              href="tel:+966920021201"
              className="block bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-gray-100 transition-all duration-300">
                  <Phone size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-brand-dark mb-1">{t('call')}</h3>
                  <p className="text-sm text-gray-500">{t('callDesc')}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-gray-500 transition-colors rtl:rotate-180" />
              </div>
            </a>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            {/* Continue to Upload Flow */}
            <button 
              onClick={onContinue}
              className="w-full text-start bg-white border border-gray-200 hover:border-brand-orange rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
                  <FileText size={28} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-brand-dark mb-1 group-hover:text-brand-orange transition-colors">{t('continue')}</h3>
                  <p className="text-sm text-gray-500">{t('continueDesc')}</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-brand-orange transition-colors rtl:rotate-180" />
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
