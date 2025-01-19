import type { CollectionConfig } from 'payload';
import { baseCollectionConfig } from './baseCollectionConfig';

const TeamMembers: CollectionConfig = {
  ...baseCollectionConfig,
  slug: 'team-members',
  admin: {
    defaultColumns: ['name', 'position', 'portrait'],
  },

  fields: [
    ...baseCollectionConfig.fields,
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'position',
      label: 'Position',
      type: 'text',
      required: true,
    },
    {
      name: 'portrait',
      label: 'Portrait',
      type: 'upload',
      relationTo: 'media',
      required: false,
      hasMany: false,
      filterOptions: {
        tags: { contains: 'team' },
      },
      displayPreview: true,
    },
  ],
};

export default TeamMembers;
