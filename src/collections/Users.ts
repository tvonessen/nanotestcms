import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Admin',
    useAsTitle: 'name',
    hidden: (args) => {
      if (args.user && args.user.role === 'user') {
        return true;
      }
      return false;
    },
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 5 * 60 * 1000, // 5 minutes,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'role', type: 'select', options: ['user', 'admin'], defaultValue: 'user' },
  ],
};
