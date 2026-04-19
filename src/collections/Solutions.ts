import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { ContactForm } from '@/blocks/ContactFormBlock';
import { Downloads } from '@/blocks/DownloadsBlock';
import { Features } from '@/blocks/FeaturesBlock';
import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import { slugField } from '@/fields/slugField';
import { solutionTypeField } from '@/fields/solutionTypeField';
import { revalidateHook } from '@/utils/revalidate';

const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: {
    singular: 'Solution',
    plural: 'Solutions',
  },
  access: {
    create: isLoggedIn,
    delete: isLoggedIn,
    read: isPublishedOrLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'category', 'slug'],
    livePreview: {
      url: ({ data, locale }) => {
        const redirect = `/${locale?.code ?? 'en'}/nt/${data.slug}`;
        return `${process.env.NEXT_PUBLIC_SERVER_URL}/api/draft?redirect=${redirect}`;
      },
    },
  },
  versions: {
    drafts: {
      schedulePublish: true,
      autosave: true,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      name: 'category',
      label: { en: 'Categories', de: 'Kategorien' },
      type: 'relationship',
      relationTo: ['solution-categories'],
      required: true,
      hasMany: true,
    },
    solutionTypeField({
      required: true,
      hasMany: true,
    }),
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'abstract',
      label: 'Abstract (Short description)',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'new',
      label: 'New',
      admin: {
        description: 'Whether this is a novel solution',
        style: { display: 'inline-block', marginInlineEnd: '2rem' },
      },
      type: 'checkbox',
      defaultValue: false,
      localized: true,
    },
    {
      name: 'discontinued',
      admin: {
        description: 'Whether this is discontinued solution',
        style: { display: 'inline-block', marginInlineEnd: '2rem' },
      },
      type: 'checkbox',
      defaultValue: false,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'details',
          label: 'Details',
          fields: [
            {
              name: 'images',
              label: 'Images',
              type: 'upload',
              relationTo: 'media' as never,
              hasMany: true,
              required: true,
              displayPreview: true,
              filterOptions: {
                or: [{ tags: { contains: 'solution' } }, { tags: { contains: 'service' } }],
              },
            },
            {
              name: 'content',
              label: 'Content',
              type: 'blocks',
              minRows: 1,
              blocks: [Text, TextImage, Highlight, TextVideo, Downloads, ContactForm, Features],
            },
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        await revalidateHook(`/nt/${doc.slug}`, req.locale);
        await revalidateHook('/', req.locale);
      },
    ],
  },
};

export default Solutions;
