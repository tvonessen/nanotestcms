import type { CollectionConfig } from 'payload';

const TeamMembers: CollectionConfig = {
  slug: 'team-members',

  admin: {
    defaultColumns: ['name', 'position', 'portrait'],
  },

  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
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
