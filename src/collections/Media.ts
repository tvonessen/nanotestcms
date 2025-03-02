import { writeFile } from 'node:fs';
import { imageToBase64, isDarkImage } from '@/app/(payload)/utility/image';
import type { CollectionConfig } from 'payload';

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      {
        name: 'blurred',
        height: 16,
      },
      {
        name: 'thumb',
        width: 240,
      },
      {
        name: 'small',
        width: 640,
      },
      {
        name: 'medium',
        width: 1280,
        withoutEnlargement: true,
      },
      {
        name: 'large',
        width: 1536,
        withoutEnlargement: true,
      },
    ],
    mimeTypes: ['image/*'],
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
    afterChange: [
      async ({ doc, req }) => {
        if (doc.mimeType.includes('svg') && req.file) {
          const fileContent = req.file?.data.toString();
          const goodSvg = fileContent.replace(/<\?xml[\s\S]*?\?>/i, '');

          goodSvg.replaceAll('xmlns:', 'xmlns_').replaceAll('xml:', 'xml_');
          writeFile(`./media/${doc.filename}`, goodSvg, (err) => console.log(err));
        }
      },
    ],
    beforeRead: [
      async ({ doc }) => {
        if (!doc.sizes.blurred) return;
        if (doc.mimeType.includes('svg')) {
          doc.blurDataUrl = '';
          doc.isDark = false;
        } else {
          /* Set blurred image data url */
          doc.blurDataUrl = imageToBase64(`./media/${doc.sizes.blurred.filename}`);
          doc.isDark = await isDarkImage(doc.blurDataUrl);
        }
      },
    ],
  },
};
