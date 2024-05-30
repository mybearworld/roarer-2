import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { getCloudlink } from "./cloudlink";
import { buildLoad, Errorable } from "./utils";

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

z.object({}).omit;

export type UsersSlice = {
  users: Record<string, Errorable<User>>;
  addUser: (user: User) => void;
  loadUser: (username: string) => Promise<void>;
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
        await get().loadUser(username);
        return;
      }
      if (user.error) {
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
  return {
    users: {},
    addUser: (user) => {
      set((state) => ({
        users: { ...state.users, [user._id]: { ...user, error: false } },
      }));
    },
    loadUser: buildLoad({
      url: (username) =>
        `https://api.meower.org/users/${encodeURIComponent(username)}`,
      schema: USER_SCHEMA,
      alreadyLoaded: (username) => username in get().users,
      onError: (username, message) => {
        set((state) => ({
          users: {
            ...state.users,
            [username]: { error: true, message },
          },
        }));
      },
      onSuccess: (user) => {
        get().addUser(user);
      },
    }),
  };
};
