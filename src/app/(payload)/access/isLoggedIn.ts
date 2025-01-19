import {Access} from "payload";

export const isLoggedIn: Access = ({ req: { user } }) => {
  return user ? true : false;
};