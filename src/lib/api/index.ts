import { create } from "zustand";
import {
  createAuthSlice,
  AuthSlice,
  USERNAME_STORAGE,
  TOKEN_STORAGE,
} from "./auth";
import { createChatsSlice, ChatsSlice } from "./chats";
import { createPostsSlice, PostsSlice } from "./posts";
import { createRoarerSlice, RoarerSlice } from "./roarer";
import { createUlistSlice, UlistSlice } from "./ulist";
import { createUsersSlice, UsersSlice } from "./users";

export type Store = AuthSlice &
  ChatsSlice &
  PostsSlice &
  RoarerSlice &
  UlistSlice &
  UsersSlice;

export const useAPI = create<Store>()((...args) => {
  return {
    ...createAuthSlice(...args),
    ...createChatsSlice(...args),
    ...createPostsSlice(...args),
    ...createRoarerSlice(...args),
    ...createUlistSlice(...args),
    ...createUsersSlice(...args),
  };
});
const state = useAPI.getState();
const storedUsername = localStorage.getItem(USERNAME_STORAGE);
const storedToken = localStorage.getItem(TOKEN_STORAGE);
if (storedUsername && storedToken) {
  state.logIn(storedUsername, storedToken, {
    keepLoggedIn: false,
    signUp: false,
  });
}
