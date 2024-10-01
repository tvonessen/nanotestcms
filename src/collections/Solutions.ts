import { Highlight } from '@/blocks/HighlightBlock';
import { Text } from '@/blocks/TextBlock';
import { TextImage } from '@/blocks/TextImageBlock';
import { CollectionConfig } from 'payload';

const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: {
    singular: 'Solution',
    plural: 'Solutions',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'seo'],
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      required: true,
      options: [
        {
          label: 'Thermal Characterization',
          value: 'thermal-characterization',
        },
        {
          label: 'Mechanial Characterization',
          value: 'mechanical-characterization',
        },
        {
          label: 'Thermal Test Equipment',
          value: 'thermal-test-equipment',
        },
      ],
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
              blocks: [Text, TextImage, Highlight],
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
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        placeholder: 'Save to auto-generate',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) throw new Error('Data is required');
        if (data.slug) return data;
        else
          return {
            ...data,
            slug: data.title.toLowerCase().replace(/ /g, '-'),
          };
      },
    ],
  },
};

export default Solutions;
