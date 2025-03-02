import type { Block } from 'payload';

export const TeamMember: Block = {
  slug: 'team-member',
  interfaceName: 'TeamMember',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      maxLength: 30,
      required: true,
      unique: true,
    },
    {
      name: 'position',
      label: 'Position',
      type: 'text',
      maxLength: 28,
      required: true,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      required: false,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
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
