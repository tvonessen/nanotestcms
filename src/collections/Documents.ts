import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import type { CollectionConfig } from 'payload';

export const DOCUMENTS_DIR = './data/documents';

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Document',
    plural: 'Documents',
  },
  admin: {
    defaultColumns: ['filename', 'filename_alt', 'description'],
    group: 'Files',
  },
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  upload: {
    staticDir: DOCUMENTS_DIR,
    mimeTypes: [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/rtf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/epub+zip',
    ],
  },
  fields: [
    {
      name: 'filename_alt',
      label: 'Alternative filename',
      type: 'text',
      admin: {
        placeholder: 'Enter an alternative filename, if needed',
      },
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      hasMany: false,
      required: true,
      options: [
        { label: 'Datasheet', value: 'datasheet' },
        { label: 'Flyer', value: 'flyer' },
        { label: 'Presentation', value: 'presentation' },
        { label: 'Whitepaper', value: 'whitepaper' },
        { label: 'Manual', value: 'manual' },
        { label: 'Document', value: 'document' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
  ],
};
