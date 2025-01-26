import type { CollectionConfig } from 'payload';
import { slugField } from '@/fields/slugField';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';

const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    defaultColumns: ['name', 'position', 'portrait'],
  },
  access: {
    create: isLoggedIn,
    delete: isLoggedIn,
    read: publishedOrLoggedIn,
    readVersions: isLoggedIn,
    update: isLoggedIn,
  },
  versions: {
    drafts: {
      schedulePublish: true,
      autosave: {
        interval: 375,
      },
    },
    maxPerDoc: 5,
  },
  fields: [
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
    slugField('name'),
  ],
};

export default TeamMembers;
