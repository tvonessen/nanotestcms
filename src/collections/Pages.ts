import type { BasePayload, CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { Cards } from '@/blocks/CardsBlock';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Downloads } from '@/blocks/DownloadsBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Hero } from '@/blocks/HeroBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import { revalidateHook } from '@/utils/revalidate';

async function resolveURL(
  payload: BasePayload,
  slug: string,
  parentId: string | null,
): Promise<string> {
  const segments: string[] = [slug];
  let currentParentId = parentId;

  while (currentParentId) {
    const parent = await payload.findByID({
      collection: 'pages',
      id: currentParentId,
      depth: 0,
    });
    if (!parent) break;
    segments.unshift(parent.slug);
    currentParentId =
      typeof parent.parent === 'string' ? parent.parent : (parent.parent?.id ?? null);
  }

  return `/${segments.join('/')}`;
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    plural: { en: 'Pages', de: 'Seiten' },
    singular: { en: 'Page', de: 'Seite' },
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'url'],
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/draft?redirect=${data.url || '/'}`,
    },
  },
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        const parentId =
          typeof data?.parent === 'string' ? data.parent : (data?.parent?.id ?? null);
        data.url = await resolveURL(req.payload, data.slug, parentId);
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // Cascade: update children's url when this page is published.
        // Skip while in draft to avoid published children revalidating with
        // a URL derived from a not-yet-live parent slug.
        if (doc._status !== 'draft') {
          const children = await req.payload.find({
            collection: 'pages',
            where: { parent: { equals: doc.id } },
            depth: 0,
            pagination: false,
          });

          for (const child of children.docs) {
            const newURL = `${doc.url}/${child.slug}`;
            if (child.url !== newURL) {
              await req.payload.update({
                collection: 'pages',
                id: child.id,
                data: { url: newURL },
                depth: 0,
              });
            }
          }
        }

        if (doc._status !== 'draft' && doc.url) {
          await revalidateHook(doc.url, req.locale);
          await revalidateHook('/', req.locale, 'layout');
        }
      },
    ],
  },
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'pages',
      filterOptions: ({ id }) => ({
        id: { not_equals: id },
        parent: { exists: false },
      }),
      admin: { position: 'sidebar' },
    },
    {
      name: 'url',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar' },
      hooks: {
        beforeChange: [({ siblingData }) => siblingData.url],
      },
    },
    {
      name: 'childPages',
      type: 'join',
      collection: 'pages',
      on: 'parent',
      admin: {
        position: 'sidebar',
        allowCreate: false,
        defaultColumns: ['title', 'slug'],
      },
    },
    {
      name: 'content',
      type: 'blocks',
      minRows: 1,
      blocks: [
        Hero,
        Text,
        TextImage,
        TextVideo,
        Cards,
        Highlight,
        Features,
        ContactForm,
        Downloads,
      ],
    },
  ],
};
