import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./auth";
import { createUsersSlice, UsersSlice } from "./users";

export type Store = AuthSlice & UsersSlice;

export const useAPI = create<Store>()((...args) => {
  return {
    ...createAuthSlice(...args),
    ...createUsersSlice(...args),
  };
});
