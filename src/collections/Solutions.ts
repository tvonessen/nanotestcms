import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { TextVideo } from '@/blocks/TextVideoBlock';
import type { CollectionConfig } from 'payload';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';
import { slugField } from '@/fields/slugField';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { solutionTypeField } from '@/fields/solutionTypeField';
import { ContactForm } from '@/blocks/ContactFormBlock';
import type { Solution } from '@/payload-types';
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
    read: publishedOrLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'slug', 'createdAt', 'updatedAt'],
    livePreview: {
      url: ({ data, collectionConfig }) =>
        `${process.env.NEXT_PUBLIC_SERVER_URL}/${collectionConfig?.slug}/${data.slug}`,
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
      name: 'type',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        solutionTypeField({
          required: true,
        }),
        {
          name: 'category',
          label: 'Category',
          type: 'relationship',
          relationTo: ['solution-categories'],
          required: true,
          hasMany: false,
        },
      ],
    },
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
      admin: {
        placeholder: 'A brief description of the solution',
      },
      required: true,
    },
    {
      name: 'new',
      label: 'New',
      admin: {
        description: 'Whether this is a novel solution',
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
                tags: { contains: 'solution' },
              },
            },
            {
              name: 'abstract',
              label: 'Abstract',
              type: 'textarea',
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
              blocks: [Text, TextImage, Highlight, TextVideo, ContactForm],
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
        let path = '/';
        switch (doc.type.type) {
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
      },
    ],
  },
};

export default Solutions;
