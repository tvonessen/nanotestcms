import type { TeamMember } from '@/payload-types';

export default function TeamMemberContact({ contact }: { contact: TeamMember }) {
  return (
    <div>
      <h3>{contact.name}</h3>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
    </div>
  );
}
