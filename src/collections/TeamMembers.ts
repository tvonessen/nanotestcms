import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { revalidateHook } from '@/utils/revalidate';

export const TeamMembers: CollectionConfig = {
  slug: 'team-member',
  labels: {
    singular: 'Team Member',
    plural: 'Team Members',
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  admin: {
    defaultColumns: ['name', 'position', 'status'],
    useAsTitle: 'name',
  },
  access: {
    read: isPublishedOrLoggedIn,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
    readVersions: isLoggedIn,
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
      localized: true,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'text',
      required: false,
      localized: true,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: false,
      localized: true,
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
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (doc._status === 'draft') return;
        revalidateHook(`${req.locale}/about`);
      },
    ],
  },
};
