import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import { slugField } from '@/fields/slugField';
import type { TeamMember } from '@/payload-types';
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
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      type: 'text',
      required: false,
      validate: (val: unknown) =>
        !val ||
        /^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(val as string) ||
        'Must be a valid LinkedIn URL',
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
    {
      name: 'business_card',
      label: { en: 'Virtual business card', de: 'Virtuelle Visitenkarte' },
      type: 'upload',
      relationTo: 'documents',
      required: false,
      hasMany: false,
      filterOptions: {
        mimeType: { contains: 'vcard' },
      },
    },
    slugField('name'),
  ],
  hooks: {
    // helper hook because email was unintentionally localized
    beforeRead: [
      async ({ doc }: { doc: TeamMember }) => {
        if (doc?.email && typeof doc.email === 'object') {
          doc.email = Object.values(doc.email)[0] as (typeof doc)['email'];
        }
        if (!doc?.slug) {
          doc.slug = doc.name.replaceAll(' ', '-').toLowerCase();
        }
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        if (doc._status === 'draft') return;
        await revalidateHook('/about', req.locale);
      },
    ],
  },
};
