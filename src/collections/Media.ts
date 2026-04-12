import { writeFile } from 'node:fs';
import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { imageToBase64, isDarkImage } from '@/app/(payload)/utility/image';

export const MEDIA_DIR = './data/media';

/**
 * MIME types that Payload's Sharp pipeline can resize.
 * Must mirror `canResizeImage()` in packages/payload/src/uploads/canResizeImage.ts.
 * For any other type (e.g. SVG) Payload skips size generation entirely.
 */
const RESIZABLE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/tiff',
  'image/avif',
];

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
    staticDir: MEDIA_DIR,
    mimeTypes: ['image/*'],
    adminThumbnail: 'thumb',
    filesRequiredOnCreate: true,
  },
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    group: 'Files',
    defaultColumns: ['filename', 'alt', 'tags'],
    description: {
      en: 'File sizes must not exceed 10 MB',
      de: 'Dateigrößen dürfen 10 MB nicht überschreiten',
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    { name: 'caption', type: 'richText', required: false, localized: true },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: { en: 'Product', de: 'Produkt' }, value: 'solution' },
        { label: 'Service', value: 'service' },
        { label: 'Logo', value: 'logo' },
        { label: 'Team', value: 'team' },
        { label: { en: 'Other', de: 'Sonstiges' }, value: 'other' },
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
      async ({ doc, req, operation }) => {
        // SVG cleanup: strip the XML declaration and sanitise namespace prefixes
        // so the markup can be safely inlined in HTML / JSX.
        if (doc.mimeType.includes('svg') && req.file) {
          const fileContent = req.file?.data.toString();
          if (fileContent != null) {
            let goodSvg = fileContent.replace(/<\?xml[\s\S]*?\?>/i, '');
            goodSvg = goodSvg.replaceAll('xmlns:', 'xmlns_').replaceAll('xml:', 'xml_');
            writeFile(`${MEDIA_DIR}/${doc.filename}`, goodSvg, (err) => {
              if (err) console.error('Failed to write sanitised SVG file:', err);
            });
          }
        }

        // When a non-resizable file (e.g. SVG) replaces an existing image that
        // previously had generated sizes, Payload skips size generation and
        // leaves the stale size records in the database.  Clear them so that
        // subsequent reads do not reference files that no longer exist.
        if (
          operation === 'update' &&
          req.file &&
          doc.mimeType &&
          !RESIZABLE_MIME_TYPES.includes(doc.mimeType as string)
        ) {
          await req.payload.db.updateOne({
            collection: 'media',
            id: doc.id,
            data: { sizes: {} },
            // Prefer the request locale; fall back to the configured default locale.
            // For non-localised fields like `sizes` the value is irrelevant, but the
            // db adapter requires a locale string.
            locale: req.payload.config.localization
              ? (req.locale ?? req.payload.config.localization?.defaultLocale ?? 'en')
              : undefined,
            req,
          });
          return { ...doc, sizes: {} };
        }
      },
    ],
    beforeRead: [
      async ({ doc }) => {
        // Use optional chaining: doc.sizes may be null/undefined for non-resizable
        // uploads such as SVG files.
        if (!doc.sizes?.blurred) return;
        if (doc.mimeType.includes('svg')) {
          doc.blurDataUrl = '';
          doc.isDark = false;
        } else {
          /* Set blurred image data url */
          doc.blurDataUrl = imageToBase64(`${MEDIA_DIR}/${doc.sizes.blurred.filename}`);
          doc.isDark = await isDarkImage(doc.blurDataUrl);
        }
      },
    ],
  },
};
