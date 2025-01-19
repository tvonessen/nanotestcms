import type { Access, FieldAccess } from 'payload';

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.role === 'admin');
};

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.role === 'admin');
};
