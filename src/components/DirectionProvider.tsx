'use client';

import {useLocale} from 'next-intl';
import {useEffect} from 'react';

export default function DirectionProvider() {
  const locale = useLocale();

  useEffect(() => {
    const isAr = locale === 'ar';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = isAr ? 'ar' : 'en';
  }, [locale]);

  return null;
}
