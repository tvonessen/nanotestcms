'use client';

import type { TeamMember } from '@/payload-types';
import TeamMemberCard from './team-member-card';
import styles from './team-members-gallery.module.scss';
import { Button } from '@heroui/react';

export default function TeamMembersGallery({ members }: { members: TeamMember[] }) {
  return (
    <section className="mx-auto">
      <ul className={`${styles.teamGalleryBeehive}`}>
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} className={styles.teamGalleryBee} />
        ))}
      </ul>
      <Button fullWidth className="md:hidden -mt-[100px]" variant="flat" color="primary" size="lg">
        View All
      </Button>
    </section>
  );
}
