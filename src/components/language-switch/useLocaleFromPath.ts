import { useEffect, useState } from 'react';

export function useLocaleFromPath(): [string, (newLoc: string) => void] {
  const [locale, setLocaleState] = useState<string>('en');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname; // e.g., "/en/some/page"
    const segments = path.split('/'); // ["", "en", "some", "page"]
    const currentLocale = segments[1] || 'en'; // Default to 'en' if not found
    setLocaleState(currentLocale);
  }, []);

  function setLocale(newLocale: string) {
    if (locale === newLocale) return;
    setLocaleState(newLocale);
    const path = window.location.pathname;
    const segments = path.split('/');
    segments[1] = newLocale; // Update the locale segment
    window.location.href = segments.join('/') + window.location.search + window.location.hash;
  }

  return [locale, setLocale];
}
