import { create } from "zustand";
import { createAuthSlice, AuthSlice } from "./auth";
import { createPostsSlice, PostsSlice } from "./posts";
import { createUsersSlice, UsersSlice } from "./users";

export type Store = AuthSlice & PostsSlice & UsersSlice;

export const useAPI = create<Store>()((...args) => {
  return {
    ...createAuthSlice(...args),
    ...createPostsSlice(...args),
    ...createUsersSlice(...args),
  };
});
useAPI.getState().loadMore();
