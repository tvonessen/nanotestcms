import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { iconField } from '@/fields/iconField';
import { revalidateHook } from '@/utils/revalidate';
import type { CollectionConfig } from 'payload';

export const SolutionCategories: CollectionConfig = {
  slug: 'solution-categories',
  access: {
    create: isLoggedIn,
    read: () => true,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'description'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    iconField({ name: 'categoryIcon' }),
  ],
  hooks: {
    afterChange: [
      async () => {
        revalidateHook('/products/');
        revalidateHook('/services/');
      },
    ],
  },
};
