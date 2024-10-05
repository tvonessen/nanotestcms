import { imageToBase64, isDarkImage } from '@/app/(payload)/utility/image';
import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      {
        name: 'blurred',
        height: 12,
      },
      {
        name: 'thumb',
        width: 240,
      },
      {
        name: 'small',
        width: 480,
      },
      {
        name: 'medium',
        width: 640,
        withoutEnlargement: true,
      },
      {
        name: 'large',
        width: 1280,
        withoutEnlargement: true,
      },
    ],
    mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml'],
    adminThumbnail: 'thumb',
    filesRequiredOnCreate: true,
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Admin',
    defaultColumns: ['filename', 'alt', 'tags'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Solution', value: 'solution' },
        { label: 'Service', value: 'service' },
        { label: 'Logo', value: 'logo' },
        { label: 'Team', value: 'team' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'blurDataUrl',
      type: 'text',
      access: {
        read: () => true,
        create: () => false,
        update: () => false,
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isDark',
      type: 'checkbox',
      access: {
        read: () => true,
        create: () => false,
        update: () => false,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeRead: [
      async ({ doc }) => {
        if (!doc.sizes.blurred) return;
        /* Set blurred image data url */
        doc.blurDataUrl = imageToBase64('./media/' + doc.sizes.blurred.filename);
        doc.isDark = await isDarkImage(doc.blurDataUrl);
      },
    ],
  },
};
