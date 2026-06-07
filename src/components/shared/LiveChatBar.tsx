'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect, useCallback } from 'react';
import { X, MessageCircle, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const getBotResponse = (userText: string, isAr: boolean): string => {
  const query = userText.toLowerCase().trim();

  if (isAr) {
    if (query.includes('سعر') || query.includes('تكلف') || query.includes('اسعار') || query.includes('فلوس') || query.includes('بكم') || query.includes('كم')) {
      return "تعتمد تكلفة الاستقدام على جنسية العامل والمهنة المطلوبة. تبدأ تكلفة استقدام العمالة المنزلية من 8,000 ريال سعودي. يرجى تزويدنا بالجنسية أو المهنة التي تهمك لنعطيك تفاصيل أدق!";
    }
    if (query.includes('سير') || query.includes('ذاتية') || query.includes('سي في') || query.includes('cv') || query.includes('طلب')) {
      return "لدينا سير ذاتية جاهزة لعمالة مؤهلة من الفلبين، الهند، كينيا، أوغندا، وبنغلاديش. للحصول على أحدث السير الذاتية المناسبة لاحتياجاتك، يمكنك الضغط على علم الدولة المطلوبة في صفحة الجنسيات لإرسال طلب فوري!";
    }
    if (query.includes('جنسي') || query.includes('دول') || query.includes('فلبين') || query.includes('هند') || query.includes('بنجلاديش') || query.includes('كينيا')) {
      return "نحن نستقدم من عدة دول تشمل الفلبين، الهند، بنغلاديش، كينيا، وأوغندا. ما هي الجنسية التي تبحث عنها لتوفير السير الذاتية المناسبة لك؟";
    }
    if (query.includes('إجراء') || query.includes('اجراء') || query.includes('تاشير') || query.includes('تأشير') || query.includes('مساند') || query.includes('كيف')) {
      return "خطوات الاستقدام هي: 1. إصدار التأشيرة عبر منصة مساند. 2. اختيار السيرة الذاتية المناسبة. 3. توقيع العقد وسداد الرسوم. 4. إنهاء إجراءات سفر العامل. تستغرق العملية عادةً بين 30 إلى 45 يوماً.";
    }
    if (query.includes('رقم') || query.includes('تواصل') || query.includes('هاتف') || query.includes('جوال') || query.includes('واتس') || query.includes('عنوان')) {
      return "يمكنك التواصل مع خدمة العملاء مباشرة عبر واتساب على الرقم +966 54 712 3180 أو الاتصال بنا. يسعدنا جداً خدمتك ومساعدتك!";
    }
    return "شكراً لرسالتك! لمزيد من التفاصيل أو للحصول على سير ذاتية مخصصة، يمكنك التواصل معنا مباشرة عبر الواتساب على الرقم +966 54 712 3180 أو زيارة صفحة اتصل بنا.";
  } else {
    if (query.includes('price') || query.includes('cost') || query.includes('how much') || query.includes('fee') || query.includes('charge')) {
      return "Recruitment costs vary by nationality and profession. Domestic worker recruitment starts from 8,000 SAR. Let us know the nationality or profession you prefer for exact pricing!";
    }
    if (query.includes('cv') || query.includes('resume') || query.includes('biodata') || query.includes('candidate') || query.includes('profile')) {
      return "We have ready CVs for qualified candidates from the Philippines, India, Bangladesh, Kenya, and Uganda. To see matching CVs, please select your preferred country in the Nationalities section on this page!";
    }
    if (query.includes('nationality') || query.includes('country') || query.includes('philippines') || query.includes('india') || query.includes('kenya')) {
      return "We recruit from the Philippines, India, Bangladesh, Kenya, and Uganda. Which nationality are you looking for?";
    }
    if (query.includes('procedure') || query.includes('step') || query.includes('visa') || query.includes('musaned') || query.includes('how to')) {
      return "Recruitment steps: 1. Issue a visa via Musaned. 2. Choose the worker's CV. 3. Sign the contract and pay the fees. 4. Complete placement and travel procedures. The process takes around 30-45 days.";
    }
    if (query.includes('contact') || query.includes('number') || query.includes('phone') || query.includes('whatsapp') || query.includes('call')) {
      return "You can reach our team directly via WhatsApp at +966 54 712 3180 or visit our Contact page. We are online and ready to assist!";
    }
    return "Thank you for your message! To get detailed assistance or customized CVs, please feel free to reach our team on WhatsApp at +966 54 712 3180 or visit our Contact page.";
  }
};

export default function LiveChatBar() {
  const t = useTranslations('liveChat');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message with marketing CTA
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: isAr
          ? "🎉 مرحباً بك في الصفار للاستقدام! نقدّم استشارة مجانية لجميع خدمات الاستقدام. أخبرنا بما تحتاجه — سواء عمالة منزلية، سائقين، عمالة ماهرة، أو تأشيرات — وسيساعدك فريقنا فوراً!"
          : "🎉 Welcome to Alsaffar Recruitment! We offer FREE consultation for all recruitment services. Tell us what you need — housemaids, drivers, skilled workers, or visa processing — and our team will assist you immediately!",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, [isAr]);

  // Scroll to bottom when messages or typing status changes
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Simulate bot typing & reply
    setTimeout(() => {
      const botReplyText = getBotResponse(text, isAr);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botReplyText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes chat-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.5); }
          50% { box-shadow: 0 0 0 12px rgba(14, 165, 233, 0); }
        }
        @keyframes online-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .chat-toggle-pulse {
          animation: chat-pulse 2s ease-in-out infinite;
        }
        .online-dot {
          animation: online-pulse 2s ease-in-out infinite;
        }
        .chat-enter {
          animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 w-[60px] h-[60px] bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 chat-toggle-pulse ${isAr ? 'left-6' : 'right-6'} ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageCircle size={26} />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 z-50 w-[370px] max-w-[calc(100vw-32px)] bg-[#111827] rounded-xl shadow-2xl overflow-hidden origin-bottom flex flex-col border border-gray-800 ${isAr ? 'left-6' : 'right-6'} ${isOpen ? 'chat-enter' : 'opacity-0 scale-95 translate-y-4 pointer-events-none transition-all duration-300'}`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white p-4 pb-3 flex justify-between items-start border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[16px] leading-tight">{t('teamName')}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full online-dot" />
                <p className="text-xs text-emerald-400 font-medium">{t('online')}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Marketing CTA Banner */}
        <div className="bg-gradient-to-r from-[#0ea5e9]/15 to-[#06b6d4]/15 border-b border-[#0ea5e9]/20 px-4 py-2.5 flex items-center gap-2">
          <Sparkles size={16} className="text-[#38bdf8] flex-shrink-0" />
          <p className="text-[13px] font-semibold text-[#7dd3fc]">
            {t('marketingCta')}
          </p>
        </div>

        {/* Chat Body */}
        <div
          ref={chatBodyRef}
          className="bg-[#0f172a] h-[260px] p-4 flex flex-col gap-3.5 overflow-y-auto"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const alignmentClass = isAr
              ? (isUser ? 'self-start' : 'self-end')
              : (isUser ? 'self-end' : 'self-start');
            const roundedClass = isUser ? 'rounded-br-none' : 'rounded-bl-none';
            const bgClass = isUser
              ? 'bg-[#0ea5e9] text-white border-[#0284c7]'
              : 'bg-[#1e293b] text-gray-200 border-gray-700';

            return (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3.5 rounded-xl border text-[13.5px] leading-relaxed shadow-sm ${alignmentClass} ${roundedClass} ${bgClass}`}
              >
                {msg.text}
              </div>
            );
          })}
          {isTyping && (
            <div className={`bg-[#1e293b] text-gray-200 border border-gray-700 p-3 rounded-xl flex gap-1.5 items-center ${isAr ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}`}>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Footer / Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 bg-[#111827] border-t border-gray-800"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('placeholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-[#1f2937] text-white placeholder:text-gray-500 border border-gray-700 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] rounded-lg px-4 py-2.5 text-[14px] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 transition-colors font-medium text-sm flex-shrink-0"
            >
              {isAr ? 'إرسال' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
