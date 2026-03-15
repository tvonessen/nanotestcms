import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import ContactForm from '@/components/content/contact-form/contact-form';
import TeamMembersGallery from '@/components/content/team-members-gallery/team-members-gallery';
import Text from '@/components/content/text';
import TextImage from '@/components/content/text-image';
import TextVideo from '@/components/content/text-video';
import { locales } from '@/config/locales';
import type { Config, TeamMember } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';
import { resolveAutoAlignment } from '@/utils/resolve-auto-alignment';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface AboutPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const about = await payload.findGlobal({
    slug: 'about',
    draft: isDraft,
    overrideAccess: isDraft,
    locale: lang,
  });

  if (!about) return notFound();

  return (
    <div className="container mx-auto">
      <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {resolveAutoAlignment(about.content ?? []).map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text key={item.id} {...item} />;
            case 'text-image':
              return <TextImage key={item.id} {...item} />;
            case 'text-video':
              return <TextVideo key={item.id} {...item} />;
            case 'contact-form':
              return (
                <ContactForm
                  key={item.id}
                  id="contact"
                  to={item.to}
                  defaultValues={{ subject: item.subject ?? undefined }}
                />
              );
            default:
              return null;
          }
        })}
      </article>

      {about.teamMembers && about.teamMembers.length > 0 && (
        <article className="sm:mt-4 sm:mb-12 md:mt-8 md:mb-16 px-4 max-w-6xl lg:mx-auto">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <TeamMembersGallery members={about.teamMembers as TeamMember[]} />
        </article>
      )}

      <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        {resolveAutoAlignment(about.content_bottom ?? []).map((item) => {
          switch (item.blockType) {
            case 'text':
              return <Text key={item.id} {...item} />;
            case 'text-image':
              return <TextImage key={item.id} {...item} />;
            case 'text-video':
              return <TextVideo key={item.id} {...item} />;
            case 'contact-form':
              return (
                <ContactForm
                  key={item.id}
                  id="contact"
                  to={item.to}
                  defaultValues={{ subject: item.subject ?? undefined }}
                />
              );
            default:
              return null;
          }
        })}
      </article>
    </div>
  );
}
