import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import TeamMembersGallery from '@/components/content/team-members-gallery/team-members-gallery';
import { locales } from '@/config/locales';
import type { Config, TeamMember } from '@/payload-types';
import { buildMetadata } from '@/utils/generateMeta';
import { isPreviewEnabled } from '@/utils/preview';

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface AboutPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const about = await payload.findGlobal({ slug: 'about', locale: lang, depth: 1 });
  return buildMetadata(about?.meta, { title: 'About — Nanotest' }, lang);
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
        <Content lang={lang} blocks={about.content} />
      </article>

      {about.teamMembers && about.teamMembers.length > 0 && (
        <article className="sm:mt-4 sm:mb-12 md:mt-8 md:mb-16 px-4 max-w-6xl lg:mx-auto">
          <h2 className="text-3xl font-bold">Our Team</h2>
          <TeamMembersGallery members={about.teamMembers as TeamMember[]} />
        </article>
      )}

      <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        <Content lang={lang} blocks={about.content_bottom} />
      </article>
    </div>
  );
}
