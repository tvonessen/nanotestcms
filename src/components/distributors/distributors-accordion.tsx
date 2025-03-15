'use client';

import type { ContactUs, DistroPartner, TeamMember } from '@/payload-types';
import { Accordion, AccordionItem } from '@heroui/react';
import React from 'react';
import RegionTabs from './region-tabs';

const regions = ['europe', 'america', 'asia', 'africa'] as const;
const RegionLabels: Record<RegionKey, string> = {
  europe: 'Europe',
  america: 'North and South America',
  asia: 'Asia and Australia',
  africa: 'Africa and Middle East',
};
export type RegionKey = (typeof regions)[number];

export default function DistributorsAccordion({ contactUs }: { contactUs: ContactUs }) {
  const distributorRegions = React.useMemo(() => {
    return regions
      .filter((region) => {
        if (Array.isArray(contactUs[region as RegionKey]?.contacts)) {
          return (contactUs[region as RegionKey]?.contacts as Array<unknown>).length > 0;
        }
      })
      .map((region) => ({
        key: region,
        label: RegionLabels[region],
        contacts: contactUs[region as RegionKey]?.contacts as Array<{
          id: string | null;
          country: string;
          contact:
            | {
                relationTo: 'distro-partner';
                value: DistroPartner;
              }
            | {
                relationTo: 'team-member';
                value: TeamMember;
              };
        }>,
      }));
  }, [contactUs]);

  if (distributorRegions.length === 0) {
    return null;
  }

  return (
    <Accordion variant="splitted">
      {distributorRegions.map((region) => (
        <AccordionItem key={region.key} title={region.label}>
          <RegionTabs contacts={region.contacts} />
        </AccordionItem>
      ))}
    </Accordion>
  );
}
