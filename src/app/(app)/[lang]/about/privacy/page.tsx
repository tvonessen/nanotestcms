import config from '@payload-config';
import { notFound } from 'next/navigation';
import { getPayload } from 'payload';
import { Content } from '@/components/content/content';
import { locales } from '@/config/locales';
import type { Config } from '@/payload-types';
import { buildMetadata } from '@/utils/generateMeta';
import { isPreviewEnabled } from '@/utils/preview';
import {Metadata} from "next";

export function generateStaticParams() {
  return locales.map(({ code }) => ({ lang: code }));
}

interface AboutPageProps {
  params: Promise<{ lang: Config['locale'] }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const legal = await payload.findGlobal({ slug: 'legal', locale: lang, depth: 1 });
  return buildMetadata(legal?.privacyMeta, { title: 'Privacy Policy — Nanotest' }, lang);
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { lang } = await params;
  const payload = await getPayload({ config });
  const isDraft = await isPreviewEnabled();
  const legal = await payload.findGlobal({
    slug: 'legal',
    draft: isDraft,
    overrideAccess: isDraft,
    locale: lang,
  });
  const analyticsSettings = await payload.findGlobal({
    slug: 'analytics-settings',
    depth: 0,
    overrideAccess: true,
  });

  if (!legal) return notFound();

  return (
    <div className="container mx-auto">
      <article className="sm:m-4 md:m-8 px-4 max-w-6xl lg:mx-auto">
        <Content blocks={legal.privacy} lang={lang} />

        <section className="grid grid-cols-12 gap-4 md:gap-8 my-12 first-of-type:mt-4 rich-text">
          <aside className="hatching hidden lg:block opacity-50 rounded-3xl lg:col-span-5 xl:col-span-4" />
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <h2 className="text-2xl font-semibold mb-2">
              {lang === 'de' ? 'Analytics-Hinweis (technisch)' : 'Analytics Notice (technical)'}
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {lang === 'de'
                  ? 'Es wird ausschließlich First-Party-Analytics ohne Drittanbieter-Script verwendet.'
                  : 'Only first-party analytics is used, without third-party analytics scripts.'}
              </li>
              <li>
                {lang === 'de'
                  ? 'Es werden keine langfristigen Nutzerprofile oder Session-Rekonstruktionen erstellt.'
                  : 'No long-term user profiles or session reconstruction are created.'}
              </li>
              <li>
                {lang === 'de'
                  ? `Daten werden als Aggregate gespeichert (Retention: ${analyticsSettings.retentionDays} Tage).`
                  : `Data is stored in aggregated form (retention: ${analyticsSettings.retentionDays} days).`}
              </li>
              <li>
                {lang === 'de'
                  ? 'Es werden keine eindeutigen Besucherkennungen erhoben.'
                  : 'No unique visitor identifiers are collected.'}
              </li>
            </ul>
          </div>
        </section>
      </article>
    </div>
  );
}
