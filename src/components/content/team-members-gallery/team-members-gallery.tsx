import type { TeamMember } from '@/payload-types';
import TeamMemberCard from './team-member-card';
import styles from './team-members-gallery.module.scss';

export default function TeamMembersGallery({ members }: { members: TeamMember[] }) {
  return (
    <ul className={`${styles.teamGalleryHoneycombs}`}>
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} className="" />
      ))}
    </ul>
  );
}
