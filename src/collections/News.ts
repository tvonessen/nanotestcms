import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Downloads } from '@/blocks/DownloadsBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Hero } from '@/blocks/HeroBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import { linkField } from '@/fields/linkField';
import { slugField } from '@/fields/slugField';
import type { News as NewsDoc } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  access: {
    read: isPublishedOrLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    defaultColumns: ['content.title', 'slug', 'publishedAt', 'unpublishAt', '_status'],
    livePreview: { url: ({ data, locale }) => `${locale.code}/news/${data.slug}` },
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: false,
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'content',
          label: { en: 'Content', de: 'Inhalt' },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: { en: 'Title', de: 'Titel' },
              required: true,
              localized: true,
            },
            {
              name: 'abstract',
              type: 'richText',
              label: { en: 'News', de: 'News' },
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'newsPage',
          label: { en: 'News Page', de: 'News-Seite' },
          fields: [
            {
              name: 'mode',
              type: 'select',
              label: { en: 'Mode', de: 'Modus' },
              required: true,
              defaultValue: 'page',
              options: [
                {
                  value: 'page',
                  label: { en: 'Distinct page', de: 'Eigenständige Seite' },
                },
                { value: 'link', label: 'Link' },
              ],
            },
            {
              name: 'content',
              type: 'blocks',
              admin: {
                condition: (_, siblingData) => siblingData.mode === 'page',
              },
              blocks: [
                Hero,
                Text,
                TextImage,
                Highlight,
                TextVideo,
                Downloads,
                ContactForm,
                Features,
              ],
            },
            linkField({
              overrides: { admin: { condition: (_, siblingData) => siblingData.mode === 'link' } },
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: { en: 'Publishing date', de: 'Veröffentlichungsdatum' },
      required: true,
      defaultValue: new Date(),
      admin: {
        position: 'sidebar',
        description: {
          en: 'The publishing date of the news. The news will not be visible on the news page until this date is reached.',
          de: 'Das Datum, das als Veröffentlichungsdatum der News angezeigt wird.',
        },
      },
    },
    {
      name: 'unpublishAt',
      type: 'date',
      label: { en: 'Unpublishing date', de: 'Datum der Offline-Nahme' },
      required: false,
      admin: {
        position: 'sidebar',
        placeholder: { en: 'Publishing date + 30 days', de: 'Veröffentlichungsdatum + 30 Tage' },
        description: {
          en: 'The unpublishing date of the news. The news will not be visible on the news page after this date is reached. Defaults to 30 days after the publishing date.',
          de: 'Das Datum, ab dem die News nicht mehr angezeigt wird. Standardmäßig 30 Tage nach dem Veröffentlichungsdatum.',
        },
      },
    },
    {
      name: 'status',
      type: 'text',
      virtual: true,
      hidden: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      defaultValue: 'draft',
      hooks: {
        afterRead: [({ siblingData }: { siblingData: Partial<NewsDoc> }) => getStatus(siblingData)],
      },
    },
    slugField('content.title'),
  ],
  hooks: {
    beforeRead: [
      ({ doc }) => {
        if (!doc) return;
        return { ...doc, status: getStatus(doc) };
      },
    ],
    beforeChange: [
      ({ data }: { data: Partial<NewsDoc> }) => {
        if (!data.slug)
          return { ...data, slug: data.content?.title.replaceAll(' ', '-').toLowerCase() };
        else return data;
      },
    ],
    afterChange: [
      // Revalidate the news page and the homepage
      async ({ doc }: { doc: NewsDoc }) => {
        await revalidateHook(`/news/${doc.slug}`, undefined);
      },
    ],
  },
};

function getStatus(doc: Partial<NewsDoc>) {
  if (!doc || doc._status === 'draft' || !doc.publishedAt) return 'draft';
  else {
    const now = Date.now();
    const publishedAt = new Date(doc.publishedAt).valueOf();
    const unpublishAt = doc.unpublishAt
      ? new Date(doc.unpublishAt).valueOf()
      : publishedAt + 30 * 24 * 60 * 60 * 1000; // Default to 30 days after publishedAt
    if (now < publishedAt) return 'scheduled';
    if (now >= unpublishAt) return `expired on ${new Date(unpublishAt).toLocaleDateString()}`;
    return 'published';
  }
}
