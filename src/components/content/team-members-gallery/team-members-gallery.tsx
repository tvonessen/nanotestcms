'use client';

import type { TeamMember } from '@/payload-types';
import TeamMemberCard from './team-member-card';
import styles from './team-members-gallery.module.scss';
import { Button } from '@heroui/react';
import React from 'react';
import { CaretDown } from '@phosphor-icons/react';

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
        className={`md:hidden ${showAll ? 'hidden' : ''} -mt-[100px]`}
        variant="flat"
        color="primary"
        size="lg"
        onPress={handleViewAllClick}
      >
        <CaretDown /> View All <CaretDown />
      </Button>
    </section>
  );
}
