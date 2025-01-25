import TeamMemberCard from '@/components/content/team-members-gallery/team-member-card';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import type { Media, TeamMember } from '@/payload-types';
import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';

export default async function AboutPage() {
  const payload = await getPayload({ config });
  const about = await payload.findGlobal({
    slug: 'about',
  });

  const teamMembers = await payload.find({
    collection: 'team-members',
    pagination: false,
  });

  if (!about) return notFound();

  return (
    <div className="container mx-auto">
      <article
        key={about.id}
        className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto"
      >
        {about.content?.map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text text={item.text} />;
            case 'text-image':
              return <TextImage text={item.text} image={item.image as Media} />;
            case 'text-video':
              return <TextVideo text={item.text} videoId={item.videoId as string} />;
            default:
              return null;
          }
        })}
      </article>
      <br />
      {teamMembers?.docs.length > 0 && (
        <article id="team-members-gallery">
          <TeamMemberCard member={teamMembers.docs[0] as TeamMember} />
        </article>
      )}
    </div>
  );
}
