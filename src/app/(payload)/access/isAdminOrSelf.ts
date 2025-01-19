import { Access } from "payload";

export const isAdminOrSelf: Access = ({ req: { user, data } }) => {
  return Boolean(user?.role === 'admin' || user?.id === data?.id);
}