import { create, StateCreator } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  createAuthSlice,
  AuthSlice,
  USERNAME_STORAGE,
  TOKEN_STORAGE,
} from "./auth";
import { createChatsSlice, ChatsSlice } from "./chats";
import { createPostsSlice, PostsSlice } from "./posts";
import { createRoarerSlice, RoarerSlice } from "./roarer";
import { createTypingSlice, TypingSlice } from "./typing";
import { createUlistSlice, UlistSlice } from "./ulist";
import { createUsersSlice, UsersSlice } from "./users";

export type Slice<T> = StateCreator<Store, [["zustand/immer", never]], [], T>;
export type Store = AuthSlice &
  ChatsSlice &
  PostsSlice &
  RoarerSlice &
  TypingSlice &
  UlistSlice &
  UsersSlice;

export const useAPI = create<Store>()(
  immer((...args) => {
    return {
      ...createAuthSlice(...args),
      ...createChatsSlice(...args),
      ...createPostsSlice(...args),
      ...createRoarerSlice(...args),
      ...createTypingSlice(...args),
      ...createUlistSlice(...args),
      ...createUsersSlice(...args),
    };
  }),
);
const state = useAPI.getState();
const storedUsername = localStorage.getItem(USERNAME_STORAGE);
const storedToken = localStorage.getItem(TOKEN_STORAGE);
if (storedUsername && storedToken) {
  state.logIn(storedUsername, storedToken, {
    keepLoggedIn: false,
    signUp: false,
    storeAccount: false,
  });
}
