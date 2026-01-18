'use client';

import { Select, SelectItem } from '@heroui/react';
import { useParams } from 'next/navigation';
import type { ChangeEvent } from 'react';

export function LanguageSwitch() {
  const { lang }: { lang: string } = useParams();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    if (selectedLang === lang) return;

    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(new RegExp(`^/${lang}/?$`), `/${selectedLang}/`);
    window.location.href = newPath + window.location.search + window.location.hash;
  };

  return (
    <Select
      aria-label="Select Language"
      className="max-w-[72px]"
      defaultSelectedKeys={[lang]}
      disallowEmptySelection
      onChange={handleChange}
      multiple={false}
      items={[
        { key: 'en', label: 'EN' },
        { key: 'de', label: 'DE' },
      ]}
    >
      {(language) => <SelectItem aria-label={language.label}>{language.label}</SelectItem>}
    </Select>
  );
}
