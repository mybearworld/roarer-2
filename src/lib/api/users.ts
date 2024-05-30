import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { getCloudlink } from "./cloudlink";
import { orError } from "./utils";

export const USER_SCHEMA = z.object({
  _id: z.string(),
  avatar: z.string(),
  avatar_color: z.string(),
  banned: z.boolean(),
  created: z.number().nullable(),
  flags: z.number(),
  last_seen: z.number().nullable(),
  lower_username: z.string(),
  lvl: z.number(),
  permissions: z.number().nullable(),
  pfp_data: z.number().nullable(),
  quote: z.string().nullable(),
  uuid: z.string().nullable(),
});
export type User = z.infer<typeof USER_SCHEMA>;

const UPDATE_USER_SCHEMA = z.object({
  cmd: z.literal("direct"),
  val: z.object({
    mode: z.literal("update_profile"),
    payload: USER_SCHEMA.omit({ _id: true })
      .partial()
      .and(z.object({ _id: z.string() })),
  }),
});

export type UsersSlice = {
  users: Record<string, User>;
  addUser: (user: User) => void;
  loadUser: (
    username: string,
  ) => Promise<{ error: true; message: string } | { error: false }>;
};
export const createUsersSlice: StateCreator<Store, [], [], UsersSlice> = (
  set,
  get,
) => {
  getCloudlink().then((cloudlink) => {
    cloudlink.on("packet", async (packet: unknown) => {
      const parsed = UPDATE_USER_SCHEMA.safeParse(packet);
      if (!parsed.success) {
        return;
      }
      const username = parsed.data.val.payload._id;
      const user = get().users[username];
      if (!user) {
        const response = await get().loadUser(username);
        if (response.error) {
          console.warn(
            `${username} changed their profile, but when fetching them the API returned ${response.message}`,
          );
        }
        return;
      }
      const newUser = { ...user, ...parsed.data.val.payload };
      console.log("setting to", newUser);
      set((state) => ({
        users: {
          ...state.users,
          [username]: newUser,
        },
      }));
    });
  });
  const gettingUsers = new Set<string>();
  return {
    users: {},
    addUser: (user) => {
      set((state) => ({ users: { ...state.users, [user._id]: user } }));
    },
    loadUser: async (username) => {
      if (gettingUsers.has(username) || username in get().users) {
        return { error: false };
      }
      gettingUsers.add(username);
      const response = orError(USER_SCHEMA).parse(
        await (
          await fetch(
            `https://api.meower.org/users/${encodeURIComponent(username)}`,
          )
        ).json(),
      );
      if (response.error) {
        return { error: true, message: response.type };
      }
      get().addUser(response);
      return { error: false };
    },
  };
};
