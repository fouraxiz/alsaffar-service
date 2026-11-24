'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'bot' | 'user';
}

/** One row from the ERP thread (see GET /api/chat). */
interface ServerMessage {
  id: number;
  direction: 'in' | 'out';
  body: string;
}

interface CollectedData {
  name: string;
  country: string;
  service: string;
  phone: string;
  notes: string;
}

const DATA_KEYS: (keyof CollectedData)[] = ['name', 'country', 'service', 'phone', 'notes'];

// Each entry is either a plain string or a function that receives the previous answer.
type QuestionFn = string | ((prev: string) => string);

const QUESTIONS: Record<'en' | 'ar', QuestionFn[]> = {
  en: [
    'What is your full name?',
    (name) => `Thank you, ${name}! Which country are you from?`,
    () =>
      'Which service do you need?\n\n• Domestic Workers\n• Drivers\n• Skilled Workers\n• Corporate Staffing\n• Visa Processing\n• Other',
    () => 'What is your phone number? (include country code, e.g. +966XXXXXXXX)',
    () => 'Any additional notes or special requirements? (type "none" to skip)',
  ],
  ar: [
    'ما هو اسمك الكامل؟',
    (name) => `شكراً، ${name}! من أي دولة أنت؟`,
    () =>
      'ما الخدمة التي تحتاجها؟\n\n• عمالة منزلية\n• سائقون\n• عمالة ماهرة\n• توظيف مؤسسي\n• تأشيرات\n• أخرى',
    () => 'ما هو رقم هاتفك؟ (مع رمز الدولة، مثلاً +966XXXXXXXX)',
    () => 'أي ملاحظات أو متطلبات إضافية؟ (اكتب "لا" إذا لم يكن لديك)',
  ],
};

function getQuestion(step: number, prevAnswer: string, isAr: boolean): string {
  const q = QUESTIONS[isAr ? 'ar' : 'en'][step];
  return typeof q === 'function' ? q(prevAnswer) : q;
}

export default function LiveChatBar() {
  const t = useTranslations('liveChat');
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatStep, setChatStep] = useState(0);
  const [collectedData, setCollectedData] = useState<CollectedData>({
    name: '', country: '', service: '', phone: '', notes: '',
  });
  // Live thread: the reply_token from /api/contact keeps this panel wired to the CRM.
  const [replyToken, setReplyToken] = useState<string | null>(null);
  const [serverLive, setServerLive] = useState(false);
  const [waLink, setWaLink] = useState<string | null>(null);
  const seenServerIds = useRef<Set<number>>(new Set());
  const lastServerId = useRef(0);
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Initialise with welcome + first question whenever locale changes.
  useEffect(() => {
    const welcome = isAr
      ? '🎉 مرحباً بك في الصفار للاستقدام! نقدّم استشارة مجانية لجميع خدمات الاستقدام.'
      : '🎉 Welcome to Alsaffar Recruitment! We offer FREE consultation for all recruitment services.';
    setMessages([
      { id: 'welcome', text: welcome, sender: 'bot' },
      { id: 'q0', text: getQuestion(0, '', isAr), sender: 'bot' },
    ]);
    setChatStep(0);
    setCollectedData({ name: '', country: '', service: '', phone: '', notes: '' });
  }, [isAr]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Staff replies arrive here: SSE while it stays open, 4s polling as a fallback.
  useEffect(() => {
    if (!replyToken) return;

    let cancelled = false;
    let source: EventSource | null = null;
    let poller: ReturnType<typeof setInterval> | null = null;
    let failures = 0;

    const ingest = (list: ServerMessage[]) => {
      const fresh = list.filter(
        (m) => m.direction === 'out' && !seenServerIds.current.has(m.id),
      );
      if (!fresh.length) return;

      fresh.forEach((m) => seenServerIds.current.add(m.id));
      lastServerId.current = Math.max(lastServerId.current, ...fresh.map((m) => m.id));
      setMessages((prev) => [
        ...prev,
        ...fresh.map((m) => ({ id: `srv-${m.id}`, text: m.body, sender: 'bot' as const })),
      ]);
    };

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/chat?reply_token=${encodeURIComponent(replyToken)}&after=${lastServerId.current}`,
          { cache: 'no-store' },
        );
        const data = (await res.json()) as { messages?: ServerMessage[] };
        if (!cancelled && Array.isArray(data?.messages)) ingest(data.messages);
      } catch {
        // Next tick retries.
      }
    };

    const startPolling = () => {
      if (poller) return;
      void poll();
      poller = setInterval(poll, 4000);
    };

    // Catch up on anything the agent sent before the stream opened.
    void poll();

    if (serverLive) {
      source = new EventSource(
        `/api/chat/stream?reply_token=${encodeURIComponent(replyToken)}&after=${lastServerId.current}`,
      );
      source.onopen = () => {
        failures = 0;
      };
      source.onmessage = (event) => {
        try {
          const incoming = JSON.parse(event.data) as ServerMessage;
          if (incoming?.id) ingest([incoming]);
        } catch {
          // Ignore a malformed frame; the next one still arrives.
        }
      };
      source.onerror = () => {
        failures += 1;
        // SSE blocked by a proxy/extension: keep the conversation alive by polling.
        if (failures >= 3) {
          source?.close();
          startPolling();
        }
      };
    } else {
      startPolling();
    }

    return () => {
      cancelled = true;
      source?.close();
      if (poller) clearInterval(poller);
    };
  }, [replyToken, serverLive]);

  const addBotMessage = (text: string, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, text, sender: 'bot' },
      ]);
      setIsTyping(false);
    }, delay);
  };

  const handleSend = async () => {
    const text = message.trim();
    if (!text) return;

    // Connected to a staff thread: every further message goes to the agent inbox.
    if (replyToken) {
      setMessages((prev) => [...prev, { id: `user-${Date.now()}`, text, sender: 'user' }]);
      setMessage('');
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_token: replyToken, message: text }),
      }).catch(() => {});
      return;
    }

    if (chatStep >= 5) return;

    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, text, sender: 'user' }]);
    setMessage('');

    // Persist the answer for the current step.
    const newData = { ...collectedData, [DATA_KEYS[chatStep]]: text };
    setCollectedData(newData);

    if (chatStep < 4) {
      // Phase 1: ask the next question.
      const nextStep = chatStep + 1;
      addBotMessage(getQuestion(nextStep, text, isAr));
      setChatStep(nextStep);
      return;
    }

    // Phase 2: CRM lead + a live thread the visitor keeps using.
    setChatStep(5);

    const d = newData;
    const notes = d.notes && !/^(none|لا|no)$/i.test(d.notes.trim()) ? d.notes.trim() : '';
    const crmMessage = [
      'Live chat consultation request',
      `Country: ${d.country}`,
      notes ? `Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const summary = isAr
      ? `✅ شكراً على معلوماتك! إليك ملخص طلبك:\n\n👤 الاسم: ${d.name}\n🌍 الدولة: ${d.country}\n🔧 الخدمة: ${d.service}\n📞 الهاتف: ${d.phone}\n📝 ملاحظات: ${d.notes}\n\nجارٍ ربطك بأحد موظفينا...`
      : `✅ Thank you! Here is your consultation request:\n\n👤 Name: ${d.name}\n🌍 Country: ${d.country}\n🔧 Service: ${d.service}\n📞 Phone: ${d.phone}\n📝 Notes: ${d.notes}\n\nConnecting you to our service agent...`;

    addBotMessage(summary);

    const waText = isAr
      ? `استشارة مجانية - الصفار للاستقدام\n\nالاسم: ${d.name}\nالدولة: ${d.country}\nالخدمة: ${d.service}\nالهاتف: ${d.phone}\nملاحظات: ${d.notes}`
      : `Free Consultation - Alsaffar Recruitment\n\nName: ${d.name}\nCountry: ${d.country}\nService: ${d.service}\nPhone: ${d.phone}\nNotes: ${d.notes}`;
    setWaLink(`https://wa.me/966920021201?text=${encodeURIComponent(waText)}`);

    // Capture in CRM Leads (same bridge as Contact Us). The reply_token returned here
    // is what turns this panel into the visitor's live chat with our team.
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: d.name,
          phone: d.phone,
          service: d.service,
          message: crmMessage,
          medium: 'chatbot',
          source: 'chatbot',
          landing_path: typeof window !== 'undefined' ? window.location.pathname : '/',
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { reply_token?: unknown; live?: boolean }
        | null;

      setServerLive(!!data?.live);

      if (typeof data?.reply_token === 'string' && data.reply_token !== '') {
        setReplyToken(data.reply_token);
        addBotMessage(
          isAr
            ? '✅ أنت الآن متصل بفريقنا. اكتب رسالتك هنا وسيصلك الرد في هذه المحادثة.'
            : '✅ You are connected to our team. Type your message here and the reply will arrive in this chat.',
          700,
        );
      }
    } catch {
      // WhatsApp (button below) stays available if the CRM call failed.
    }
  };

  const isDone = chatStep >= 5;
  const composerLocked = isDone && !replyToken;

  return (
    <>
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
        .chat-toggle-pulse { animation: chat-pulse 2s ease-in-out infinite; }
        .online-dot { animation: online-pulse 2s ease-in-out infinite; }
        .chat-enter { animation: slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 z-50 w-[60px] h-[60px] bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 chat-toggle-pulse ${isAr ? 'left-6' : 'right-6'} ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageCircle size={26} />
      </button>

      {/* Chat window */}
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

        {/* Marketing CTA banner */}
        <div className="bg-gradient-to-r from-[#0ea5e9]/15 to-[#06b6d4]/15 border-b border-[#0ea5e9]/20 px-4 py-2.5 flex items-center gap-2">
          <Sparkles size={16} className="text-[#38bdf8] flex-shrink-0" />
          <p className="text-[13px] font-semibold text-[#7dd3fc]">{t('marketingCta')}</p>
        </div>

        {/* Chat body */}
        <div
          ref={chatBodyRef}
          className="bg-[#0f172a] h-[260px] p-4 flex flex-col gap-3.5 overflow-y-auto"
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={[
                  'max-w-[85%] p-3.5 rounded-xl border text-[13.5px] leading-relaxed shadow-sm whitespace-pre-wrap',
                  isAr
                    ? isUser ? 'self-start rounded-br-none' : 'self-end rounded-bl-none'
                    : isUser ? 'self-end rounded-br-none' : 'self-start rounded-bl-none',
                  isUser
                    ? 'bg-[#0ea5e9] text-white border-[#0284c7]'
                    : 'bg-[#1e293b] text-gray-200 border-gray-700',
                ].join(' ')}
              >
                {msg.text}
              </div>
            );
          })}
          {isTyping && (
            <div
              className={`bg-[#1e293b] text-gray-200 border border-gray-700 p-3 rounded-xl flex gap-1.5 items-center ${isAr ? 'self-end rounded-br-none' : 'self-start rounded-bl-none'}`}
            >
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Input area */}
        <form
          onSubmit={(e) => { e.preventDefault(); void handleSend(); }}
          className="p-3.5 bg-[#111827] border-t border-gray-800"
        >
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={
                replyToken
                  ? t('placeholder')
                  : composerLocked
                    ? (isAr ? 'تم إرسال طلبك ✓' : 'Request sent ✓')
                    : t('placeholder')
              }
              disabled={composerLocked}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-[#1f2937] text-white placeholder:text-gray-500 border border-gray-700 focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] rounded-lg px-4 py-2.5 text-[14px] outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!message.trim() || composerLocked}
              className="bg-[#0ea5e9] hover:bg-[#0284c7] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 transition-colors font-medium text-sm flex-shrink-0"
            >
              {isAr ? 'إرسال' : 'Send'}
            </button>
          </div>
          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-[12px] font-medium text-[#25D366] hover:underline"
            >
              {isAr ? 'أو تابع المحادثة على واتساب' : 'Or continue the conversation on WhatsApp'}
            </a>
          )}
        </form>
      </div>
    </>
  );
}
