import type { CollectionConfig } from 'payload';
import { baseCollectionConfig } from './baseCollectionConfig';

export const Jumbotron: CollectionConfig = {
  ...baseCollectionConfig,
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
    ...baseCollectionConfig.fields,
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      unique: true,
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
