'use client';

import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {useTransition} from 'react';
import {Globe} from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === 'en' ? 'ar' : 'en';
  const label = locale === 'en' ? 'العربية' : 'English';

  const handleSwitch = () => {
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white transition-colors duration-200 text-sm font-semibold disabled:opacity-50"
      aria-label={`Switch to ${label}`}
    >
      <Globe size={15} />
      <span>{label}</span>
    </button>
  );
}
