import type { CollectionConfig } from 'payload';

export const Highscores: CollectionConfig = {
  slug: 'highscores',
  admin: {
    group: 'Sudoku',
    useAsTitle: 'playerName',
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'playerName',
      type: 'text',
      required: true,
    },
    {
      name: 'time',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Time in seconds',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' },
      ],
    },
    {
      name: 'completedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
};
