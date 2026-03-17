'use client';

import { Tab, Tabs } from '@heroui/react';
import React from 'react';
import type { DistroPartner, TeamMember } from '@/payload-types';
import DistroPartnerContact from './distro-partner-contact';
import TeamMemberContact from './team-member-contact';

interface RegionTabsProps {
  countries: {
    country: string;
    contacts: (
      | {
          relationTo: 'distro-partner';
          value: string | DistroPartner;
        }
      | {
          relationTo: 'team-member';
          value: string | TeamMember;
        }
    )[];
  }[];
}

export default function RegionTabs({ countries }: RegionTabsProps) {
  const regions = React.useMemo(() => {
    return countries.map(({ country, contacts }) => ({
      id: country,
      label: country,
      content: contacts
        .filter((contact) => typeof contact.value === 'object')
        .map(({ relationTo, value }) =>
          relationTo === 'distro-partner' ? (
            <DistroPartnerContact
              key={(value as DistroPartner).id}
              contact={value as DistroPartner}
            />
          ) : (
            <TeamMemberContact key={(value as TeamMember).id} contact={value as TeamMember} />
          ),
        ),
    }));
  }, [countries]);

  return (
    <Tabs
      classNames={{
        tabWrapper: 'border-2',
        tabList: 'flex flex-col sm:flex-row flex-wrap border-2',
        tab: 'w-full sm:w-auto cursor-pointer',
        panel: 'pb-4 px-2',
      }}
      fullWidth
      variant="light"
      color="primary"
      radius="sm"
      size="lg"
      aria-label="Contact Regions"
      items={regions}
    >
      {regions
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((region) => (
          <Tab key={region.id} title={region.label}>
            <div className="flex rounded-md gap-2 flex-col md:flex-row flex-wrap justify-stretch">
              {region.content}
            </div>
          </Tab>
        ))}
    </Tabs>
  );
}
