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
        const type = (data.type as string[])?.[0];
        const segment = type === 'product' ? 'products' : 'services';
        const redirect = `/${locale?.code ?? 'en'}/${segment}/${data.slug}`;
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
      label: 'Category',
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
      name: 'shortDescription',
      label: 'Short Description',
      type: 'textarea',
      localized: true,
      admin: {
        placeholder: 'A (very) brief description of the solution',
        rows: 2,
      },
      required: true,
      maxLength: 120,
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
              name: 'abstract',
              label: 'Abstract',
              type: 'textarea',
              localized: true,
              required: true,
              admin: {
                placeholder: 'A catchy abstract text',
                description: "Deprecated! Use Aside of content block 'Text'",
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
        {
          name: 'seo',
          label: 'SEO',
          fields: [
            {
              name: 'keywords',
              type: 'text',
            },
          ],
        },
      ],
    },
    slugField(),
  ],
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (doc._status === 'draft') return;
        for (const type of doc.type) {
          let path = '/';
          switch (type) {
            case 'product':
              path += 'products';
              break;
            case 'service':
              path += 'services';
              break;
            default:
              break;
          }
          revalidateHook(`${path}/${doc.slug}`, req.locale);
          revalidateHook(path, req.locale);
        }
      },
    ],
  },
};

export default Solutions;
