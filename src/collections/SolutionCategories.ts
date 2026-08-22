import type { CollectionConfig } from 'payload';
import { isLoggedIn } from '@/app/(payload)/access/isLoggedIn';
import { iconField } from '@/fields/iconField';
import { revalidateHook } from '@/utils/revalidate';

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
    defaultColumns: ['title', 'description'],
  },
  orderable: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
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
      async ({ req }) => {
        await revalidateHook('/', req.locale);
      },
    ],
  },
};
