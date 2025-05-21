import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import type { TeamMember } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';
import type { CollectionConfig } from 'payload';

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
    maxPerDoc: 10,
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
  hooks: {
    afterChange: [
      ({ doc }: { doc: TeamMember }) => {
        if (doc._status === 'draft') return;
        revalidateHook('/about');
      },
    ],
  },
};
