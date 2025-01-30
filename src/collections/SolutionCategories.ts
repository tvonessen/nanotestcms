import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { publishedOrLoggedIn } from '@/app/(payload)/access/publishedOrLoggedIn';
import { iconField } from '@/fields/iconField';
import { solutionTypeField } from '@/fields/solutionTypeField';
import type { CollectionConfig } from 'payload';

export const SolutionCategories: CollectionConfig = {
  slug: 'solution-categories',
  access: {
    create: isLoggedIn,
    read: publishedOrLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    solutionTypeField({}),
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
};
