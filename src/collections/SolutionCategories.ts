import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { iconField } from '@/fields/iconField';
import { solutionTypeField } from '@/fields/solutionTypeField';
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
  },
  fields: [
    solutionTypeField({
      required: true,
    }),
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
