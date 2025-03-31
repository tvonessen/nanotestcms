import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import type { CollectionConfig } from 'payload';

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
    staticDir: 'documents',
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
      name: 'description',
      type: 'textarea',
    },
  ],
};
