import { Button } from '@heroui/button';
import { cn } from '@heroui/react';
import config from '@payload-config';
import {
  AtIcon,
  IdentificationCardIcon,
  LinkedinLogoIcon,
  PhoneIcon,
} from '@phosphor-icons/react/dist/ssr';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import TeamMemberCard from '@/components/content/team-members-gallery/team-member-card';
import { locales } from '@/config/locales';
import type { Config, Document } from '@/payload-types';
import { isPreviewEnabled } from '@/utils/preview';

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const params: { lang: Config['locale']; teamMember: string }[] = [];

  for (const { code } of locales) {
    const allTeamMembers = await payload.find({
      collection: 'team-member',
      pagination: false,
      depth: 0,
      locale: code as Config['locale'],
      where: { _status: { equals: 'published' } },
    });

    for (const doc of allTeamMembers.docs) {
      params.push({ lang: code as Config['locale'], teamMember: doc.slug as string });
    }
  }

  return params;
}

interface TeamMemberPageProps {
  params: Promise<{ lang: Config['locale']; teamMember: string }>;
}

export default async function TeamMemberPage(props: TeamMemberPageProps) {
  const { lang, teamMember } = await props.params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const person = (
    await payload.find({
      collection: 'team-member',
      draft: isDraft,
      overrideAccess: isDraft,
      locale: lang,
      depth: 3,
      where: { slug: { equals: teamMember } },
    })
  ).docs[0];

  if (!person) return notFound();

  return (
    <div className="container max-w-md md:max-w-3xl mx-auto px-4">
      <h1 className="text-xl md:text-3xl text-secondary font-bold mt-8 md:mt-16 mb-4">
        {lang === 'de' ? 'Ihr Ansprechpartner' : 'Your contact person'}
      </h1>

      <div
        className={cn(
          'p-4 md:p-8 rounded-xl bg-foreground/10 border-4 border-secondary/40',
          'flex flex-row flex-wrap justify-center',
          'md:justify-start items-center gap-8',
        )}
      >
        <TeamMemberCard member={person} className="pointer-events-none size-64 w-fit!" />

        <div className="">
          <h2 className="font-black text-primary text-2xl">{person.name}</h2>
          <h3 className="text-secondary text-lg mb-8">{person.position}</h3>

          <div className="grid grid-cols-[24px_auto] gap-x-6 gap-y-3 mb-4">
            {person.email && (
              <>
                <AtIcon weight="bold" size={28} className="fill-primary" />
                <a
                  href={`mailto://${person.email}`}
                  className="underline decoration-2 decoration-transparent hover:decoration-primary transition-colors"
                >
                  {person.email}
                </a>
              </>
            )}

            {person.phone && (
              <>
                <PhoneIcon weight="bold" size={28} className="fill-primary" />
                <a
                  href={`tel://${person.phone}`}
                  className="underline decoration-2 decoration-transparent hover:decoration-primary transition-colors"
                >
                  {person.phone}
                </a>
              </>
            )}

            {person.linkedin && (
              <>
                <LinkedinLogoIcon weight="bold" size={28} className="fill-primary" />
                <a
                  href={person.linkedin}
                  className="underline decoration-2 decoration-transparent hover:decoration-primary transition-colors"
                >
                  {person.linkedin
                    .replace('https://www.linkedin.com/in', '')
                    .replace('https://linkedin.com/in', '')}
                </a>
              </>
            )}
          </div>
        </div>

        {person.business_card && typeof person.business_card !== 'string' && (
          <a href={(person.business_card as Document).url ?? ''} download className="basis-full">
            <Button color="primary" className="text-lg w-full">
              <IdentificationCardIcon size={28} />{' '}
              {lang === 'de' ? 'Kontakt speichern' : 'Save contact'}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
