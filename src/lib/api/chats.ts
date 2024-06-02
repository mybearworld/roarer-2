import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { request, Errorable } from "./utils";

export const CHAT_SCHEMA = z
  .object({
    created: z.number(),
    deleted: z.literal(false),
    last_active: z.number(),
    members: z.string().array(),
    type: z.number(),
    _id: z.string(),
  })
  .and(
    z
      .object({
        nickname: z.string().nullable(),
        owner: z.string(),
      })
      .or(
        z.object({
          nickname: z.null(),
          owner: z.null(),
        }),
      ),
  );
export type Chat = z.infer<typeof CHAT_SCHEMA>;

const CHATS_RESPONSE_SCHEMA = z.object({
  autoget: CHAT_SCHEMA.array(),
  // even though this endpoint looks like it's paginated, it is not
});

export type ChatsSlice = {
  userChats: Errorable<{ chats: string[] }> | undefined;
  chats: Record<string, Errorable<Chat | { deleted: true }>>;
  addChat: (chat: Chat) => void;
  loadChats: () => Promise<void>;
  loadChat: (chat: string) => Promise<void>;
  getDM: (
    username: string,
  ) => Promise<
    { error: true; message: string } | { error: false; chat: string }
  >;
};
export const createChatsSlice: StateCreator<Store, [], [], ChatsSlice> = (
  set,
  get,
) => {
  const loadingChats = new Set<string>();
  const dmsByUsername = new Map<string, string>();
  return {
    userChats: undefined,
    chats: {},
    addChat: (chat) => {
      set((state) => ({
        chats: {
          ...state.chats,
          [chat._id]: { ...chat, error: false },
        },
      }));
    },
    loadChats: async () => {
      const state = get();
      if (state.userChats) {
        return;
      }
      const credentials = get().credentials;
      const response = await request(
        fetch("https://api.meower.org/chats", {
          headers: credentials ? { Token: credentials.token } : {},
        }),
        CHATS_RESPONSE_SCHEMA,
      );
      if (!response.error) {
        response.response.autoget.forEach((chat) => {
          state.addChat(chat);
        });
      }
      set(() => ({
        userChats: response.error
          ? ({ error: true, message: response.message } as const)
          : ({
              error: false,
              chats: response.response.autoget.map((chat) => chat._id),
            } as const),
      }));
    },
    loadChat: async (chat: string) => {
      if (chat in get().chats || loadingChats.has(chat)) {
        return;
      }
      loadingChats.add(chat);
      const response = await request(
        fetch(`https://api.meower.org/chats/${encodeURIComponent(chat)}`),
        CHAT_SCHEMA,
      );
      if (response.error) {
        set((state) => ({
          chats: {
            ...state.chats,
            [chat]: { error: true, message: response.message },
          },
        }));
        return;
      }
      get().addChat(response.response);
      loadingChats.delete(chat);
    },
    getDM: async (username: string) => {
      const state = get();
      const dm = dmsByUsername.get(username);
      if (dm) {
        return { error: false, chat: dm };
      }
      // unlike the other endpoints, _this_ endpoint doesn't have an error
      // flag and just throws with only a status code
      let response;
      try {
        response = CHAT_SCHEMA.parse(
          await (
            await fetch(
              `https://api.meower.org/users/${encodeURIComponent(username)}/dm`,
              {
                headers: state.credentials
                  ? { Token: state.credentials.token }
                  : {},
              },
            )
          ).json(),
        );
      } catch (e) {
        return { error: true, message: (e as Error).message };
      }
      get().addChat(response);
      set((state) => ({
        userChats:
          state.userChats === undefined || state.userChats.error
            ? state.userChats
            : {
                ...state.userChats,
                chats: [...state.userChats.chats, response._id],
              }, // this should type error. why is it not
      }));
      dmsByUsername.set(username, response._id);
      return { error: false, chat: response._id };
    },
  };
};
