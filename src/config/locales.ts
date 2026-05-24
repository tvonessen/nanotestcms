export const locales: { code: string; label: string; uiLocale: string; openGraphLocale: string }[] =
  [
    { code: 'en', label: 'English', uiLocale: 'en-US', openGraphLocale: 'en_US' },
    { code: 'de', label: 'Deutsch', uiLocale: 'de-DE', openGraphLocale: 'de_DE' },
  ];

export function getUILocale(code: string): string {
  return locales.find((locale) => locale.code === code)?.uiLocale ?? 'en-US';
}

export function getOpenGraphLocale(code: string): string {
  return locales.find((locale) => locale.code === code)?.openGraphLocale ?? 'en_US';
}
