import type { Access } from 'payload';

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'admin') {
    return true;
  }

  if (!user) {
    return false;
  }

  if (id) {
    return user.id === id;
  }

  return {
    id: {
      equals: user.id,
    },
  };
};