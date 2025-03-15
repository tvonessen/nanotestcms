import { isAdmin } from '@/app/(payload)/access/isAdmin';
import { isAdminOrSelf } from '@/app/(payload)/access/isAdminOrSelf';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
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
    maxLoginAttempts: 50,
    lockTime: 0,
    // lockTime: 5 * 60 * 1000, // 5 minutes,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'role', type: 'select', options: ['user', 'admin'], defaultValue: 'user' },
  ],
};
