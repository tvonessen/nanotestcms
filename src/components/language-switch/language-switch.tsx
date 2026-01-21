'use client';

import { Select, SelectItem } from '@heroui/react';
import { useParams, useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';

export function LanguageSwitch() {
  const { lang }: { lang: string } = useParams();
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    if (selectedLang === lang) return;

    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(new RegExp(`\\/${lang}\\/?\\b`), `/${selectedLang}/`);

    router.push(newPath + window.location.search + window.location.hash);
  };

  return (
    <Select
      variant="flat"
      color="default"
      size="md"
      aria-label="Select Language"
      classNames={{
        base: 'w-18 ms-1.5',
        trigger: 'cursor-pointer',
      }}
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
