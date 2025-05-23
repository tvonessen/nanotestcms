import ContactForm from '@/components/content/contact-form/contact-form';
import TeamMembersGallery from '@/components/content/team-members-gallery/team-members-gallery';
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

  if (!about) return notFound();

  return (
    <div className="container mx-auto">
      <article className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {about.content?.map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text key={item.id} text={item.text} />;
            case 'text-image':
              return <TextImage key={item.id} text={item.text} image={item.image as Media} />;
            case 'text-video':
              return <TextVideo key={item.id} text={item.text} videoId={item.videoId as string} />;
            case 'contact-form':
              return (
                <div className="col-span-full">
                  <ContactForm
                    key={item.id}
                    id="contact"
                    to={item.to}
                    defaultValues={{ subject: item.subject ?? undefined }}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </article>
      {about.teamMembers && about.teamMembers.length > 0 && (
        <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <TeamMembersGallery members={about.teamMembers as TeamMember[]} />
        </article>
      )}
      <article className="grid grid-cols-12 gap-6 sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {about.content_bottom?.map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text key={item.id} text={item.text} />;
            case 'text-image':
              return <TextImage key={item.id} text={item.text} image={item.image as Media} />;
            case 'text-video':
              return <TextVideo key={item.id} text={item.text} videoId={item.videoId as string} />;
            case 'contact-form':
              return (
                <div className="col-span-full">
                  <ContactForm
                    key={item.id}
                    id="contact"
                    to={item.to}
                    defaultValues={{ subject: item.subject ?? undefined }}
                  />
                </div>
              );
            default:
              return null;
          }
        })}
      </article>
    </div>
  );
}
