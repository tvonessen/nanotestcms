import type { CollectionConfig, PayloadRequest } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { isPublishedOrLoggedIn } from '@/app/(payload)/access/isPublishedOrLoggedIn';
import type { Solution } from '@/payload-types';
import { revalidateHook } from '@/utils/revalidate';

export const DistroPartners: CollectionConfig = {
  slug: 'distro-partner',
  labels: {
    singular: 'Distro Partner',
    plural: 'Distro Partners',
  },
  access: {
    create: isLoggedIn,
    read: isPublishedOrLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  versions: {
    drafts: {
      autosave: true,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
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
      name: 'address',
      label: 'Address',
      type: 'richText',
      localized: true,
    },
    {
      name: 'website',
      label: 'Website',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'logo',
      label: 'Logo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: {
        tags: { contains: 'logo' },
      },
    },
    {
      name: 'contactperson',
      type: 'group',
      label: 'Contact Person',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          label: 'Phone',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req }: { doc: Solution; req: PayloadRequest }) => {
        if (doc._status === 'draft') return;
        const lang = req.locale ?? 'en';
        revalidateHook(`${lang}/contact`);
      },
    ],
  },
};
