'use client';

import { Button } from '@heroui/react';
import { CaretDownIcon } from '@phosphor-icons/react';
import React from 'react';
import type { TeamMember } from '@/payload-types';
import TeamMemberCard from './team-member-card';
import styles from './team-members-gallery.module.scss';

export default function TeamMembersGallery({ members }: { members: TeamMember[] }) {
  const [showAll, setShowAll] = React.useState<boolean>(false);

  function handleViewAllClick() {
    setShowAll(true);
  }

  return (
    <section className="mx-auto">
      <ul className={`${styles.teamGalleryBeehive}`}>
        {members
          .filter((member) => member.name && member.id)
          .map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              className={`${styles.teamGalleryBee} ${showAll ? 'show-all' : ''}`}
            />
          ))}
      </ul>
      <Button
        fullWidth
        className={`md:hidden ${showAll || members.length <= 5 ? 'hidden' : ''} -mt-25`}
        variant="flat"
        color="primary"
        size="lg"
        onPress={handleViewAllClick}
      >
        <CaretDownIcon /> View All <CaretDownIcon />
      </Button>
    </section>
  );
}
