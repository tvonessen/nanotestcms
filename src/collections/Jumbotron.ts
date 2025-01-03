import type { CollectionConfig } from 'payload';

export const Jumbotron: CollectionConfig = {
  slug: 'jumbotron',
  labels: {
    singular: 'Jumbotron',
    plural: 'Jumbotron',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'link'],
    group: 'Homepage',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'link',
      label: 'Link',
      type: 'text',
      required: true,
    },
  ],
};
