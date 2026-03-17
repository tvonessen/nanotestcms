'use client';

import { Accordion, AccordionItem } from '@heroui/react';
import React from 'react';
import type { ContactUs } from '@/payload-types';
import RegionTabs from './region-tabs';

const regionKeys = ['europe', 'america', 'asia', 'africa'] as const;
const RegionLabels = {
  europe: { en: 'Europe', de: 'Europa' },
  america: { en: 'North and South America', de: 'Nord- und Südamerika' },
  asia: { en: 'Asia and Australia', de: 'Asien und Australien' },
  africa: { en: 'Africa and Middle East', de: 'Afrika und Naher Osten' },
};
export type RegionKey = (typeof regionKeys)[number];

interface DistributorsAccordionProps {
  contactUs: ContactUs;
  lang: 'de' | 'en';
}

export default function DistributorsAccordion(props: DistributorsAccordionProps) {
  const { contactUs, lang } = props;
  const availableRegions = regionKeys.filter((region) => {
    const countries = contactUs[region]?.countries;
    return Array.isArray(countries) && countries.length > 0;
  });

  const regions = React.useMemo(() => {
    return availableRegions.map((region) => ({
      key: region,
      label: RegionLabels[region][lang],
      countries: contactUs[region as RegionKey]?.countries ?? [],
    }));
  }, [lang, availableRegions, contactUs]);

  if (regions.length === 0) {
    return null;
  }

  if (!regions || regions.length === 0) return null;

  return (
    <Accordion variant="splitted">
      {regions.map((region) => (
        <AccordionItem key={region.key} title={region.label}>
          <RegionTabs countries={region.countries} />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
