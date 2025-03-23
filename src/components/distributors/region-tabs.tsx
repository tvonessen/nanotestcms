'use client';

import type { DistroPartner, TeamMember } from '@/payload-types';
import { Tab, Tabs } from '@heroui/react';
import React from 'react';
import DistroPartnerContact from './distro-partner-contact';
import TeamMemberContact from './team-member-contact';

interface RegionTabsProps {
  contacts: {
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
  }[];
}

export default function RegionTabs({ contacts }: RegionTabsProps) {
  const regions = React.useMemo(() => {
    return contacts.map((region) => ({
      id: region.country,
      label: region.country,
      content:
        region.contact.relationTo === 'distro-partner' ? (
          <DistroPartnerContact contact={region.contact.value as DistroPartner} />
        ) : (
          <TeamMemberContact contact={region.contact.value as TeamMember} />
        ),
    }));
  }, [contacts]);

  return (
    <Tabs
      classNames={{
        tabWrapper: 'border-2',
        tabList: 'flex flex-col sm:flex-row flex-wrap border-2',
        tab: 'w-full sm:w-auto',
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
            {region.content}
          </Tab>
        ))}
    </Tabs>
  );
}
