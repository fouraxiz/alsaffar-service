'use client';

import {useEffect, useState} from 'react';
import {X} from 'lucide-react';
import {useLocale} from 'next-intl';

const WhatsAppIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function WhatsAppPopup() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Show only once per browser session — the first time the site is opened
    if (sessionStorage.getItem('alsaffar_wa_popup_shown')) return;

    // Appear after ~1 second — stays until user closes or clicks WhatsApp
    const showTimer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem('alsaffar_wa_popup_shown', '1');
    }, 1000);
    return () => clearTimeout(showTimer);
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(() => setVisible(false), 300);
  }

  if (!visible) return null;

  const waMsg = isAr ? 'السلام عليكم، أريد الاستفسار عن خدمات الاستقدام' : 'Hello! I would like to inquire about your recruitment services.';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 pointer-events-auto ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />

      {/* Popup card */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-sm pointer-events-auto transition-all duration-300 ${
          closing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Green header */}
        <div className="bg-[#25D366] rounded-t-3xl px-6 py-5 flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <WhatsAppIcon />
          </div>
          <div className="text-white">
            <div className="font-black text-lg leading-tight">
              {isAr ? 'الصفار للاستقدام' : 'Alsaffar Recruitment'}
            </div>
            <div className="text-white/80 text-sm flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse inline-block" />
              {isAr ? 'متاح الآن' : 'Available Now'}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="ms-auto w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-brand-dark font-semibold text-base mb-1">
            {isAr ? 'أهلاً بكم في الصفار للاستقدام! 👋' : 'Welcome to Alsaffar Recruitment! 👋'}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            {isAr
              ? 'تواصل معنا عبر واتساب للحصول على أسعار واستفسارات فورية.'
              : 'Chat with us on WhatsApp for instant quotes and enquiries.'}
          </p>

          <a
            href={`https://wa.me/966547123180?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3.5 rounded-2xl font-bold text-base transition-colors duration-200"
          >
            <WhatsAppIcon />
            {isAr ? 'ابدأ المحادثة الآن' : 'Start Chat Now'}
          </a>

          <button
            onClick={handleClose}
            className="w-full text-center text-gray-400 hover:text-gray-600 text-sm mt-3 py-1 transition-colors"
          >
            {isAr ? 'ربما لاحقاً' : 'Maybe Later'}
          </button>
        </div>
      </div>
    </div>
  );
}
