import type { TeamMember } from '@/payload-types';
import TeamMemberCard from './team-member-card';

export default function TeamMembersGallery({ members }: { members: TeamMember[] }) {
  return (
    <ul className="grid gap-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} className="nth-Child" />
      ))}
    </ul>
  );
}
