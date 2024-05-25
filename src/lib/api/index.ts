import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./auth";

export type Store = AuthSlice;

export const useAPI = create<Store>()((...args) => {
  return {
    ...createAuthSlice(...args),
  };
});
