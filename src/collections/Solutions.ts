import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import type { CollectionConfig } from 'payload';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { slugField } from '@/fields/slugField';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { solutionTypeField } from '@/fields/solutionTypeField';
import { ContactForm } from '@/blocks/ContactFormBlock';
import type { Solution } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';
import { Downloads } from '@/blocks/DownloadsBlock';

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
      url: ({ data }) =>
        `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SERVER_URL : process.env.NEXT_DEV_SERVER_URL}/${data.type[0]}s/${data.slug}`,
    },
  },
  versions: {
    drafts: {
      schedulePublish: true,
      autosave: true,
    },
    maxPerDoc: 20,
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
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: true,
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
    },
    {
      name: 'discontinued',
      admin: {
        description: 'Whether this is discontinued solution',
        style: { display: 'inline-block', marginInlineEnd: '2rem' },
      },
      type: 'checkbox',
      defaultValue: false,
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
              },
            },
            {
              name: 'content',
              label: 'Content',
              type: 'blocks',
              minRows: 1,
              blocks: [Text, TextImage, Highlight, TextVideo, Downloads, ContactForm],
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
      ({ doc }: { doc: Solution }) => {
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
          revalidateHook(`${path}/${doc.slug}`);
          revalidateHook(path);
        }
      },
    ],
  },
};

export default Solutions;
