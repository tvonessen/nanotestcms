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
    defaultColumns: ['title', 'position', 'description'],
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
    {
      name: 'position',
      type: 'number',
      label: 'Order',
      required: true,
      defaultValue: 50,
      min: 0,
      max: 100,
      admin: {
        description:
          'The position at which this category will be displayed. If another category has the same order, the one created first will be displayed first.',
        step: 1,
        placeholder: '50',
      },
    },
    iconField({ name: 'categoryIcon' }),
  ],
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        const references = await req.payload.find({
          collection: 'solutions',
          where: {
            category: {
              equals: id,
            },
          },
        });
        if (references.totalDocs > 0) {
          throw new Error(
            `Cannot delete this category because it is being used by a solutions: ${references.docs.map((ref) => ref.title).join(', ')}.`,
          );
        }
      },
    ],
    afterChange: [
      async () => {
        revalidateHook('/products/');
        revalidateHook('/services/');
      },
    ],
  },
};
