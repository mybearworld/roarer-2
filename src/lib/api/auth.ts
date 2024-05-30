import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { getCloudlink } from "./cloudlink";
import { USER_SCHEMA } from "./users";

const AUTH_RESPONSE = z
  .object({
    cmd: z.literal("direct"),
    listener: z.literal("loginRequest"),
    val: z.object({
      mode: z.literal("auth"),
      payload: z.object({
        account: USER_SCHEMA,
        token: z.string(),
      }),
    }),
  })
  .or(
    z.object({
      cmd: z.literal("statuscode"),
      listener: z.literal("loginRequest"),
      val: z.string(),
    }),
  );

export const USERNAME_STORAGE = "roarer2:username";
export const TOKEN_STORAGE = "roarer2:token";

export type AuthSlice = {
  credentials: {
    username: string;
    token: string;
  } | null;
  logIn: (
    username: string,
    password: string,
    options: { signUp: boolean; keepLoggedIn: boolean },
  ) => Promise<{ error: true; message: string } | { error: false }>;
  signOut: () => void;
};
export const createAuthSlice: StateCreator<Store, [], [], AuthSlice> = (
  set,
  get,
) => {
  return {
    credentials: null,
    logIn: (username, password, options) => {
      return new Promise((resolve) => {
        getCloudlink().then((cloudlink) => {
          cloudlink.on("packet", (packet: unknown) => {
            const parsed = AUTH_RESPONSE.safeParse(packet);
            if (!parsed.success) {
              return;
            }
            if (parsed.data.cmd === "statuscode") {
              if (parsed.data.val === "I:100 | OK") {
                return;
              }
              resolve({ error: true, message: parsed.data.val });
              return;
            }
            set({
              credentials: { username, token: parsed.data.val.payload.token },
            });
            if (options.keepLoggedIn) {
              localStorage.setItem(USERNAME_STORAGE, username);
              localStorage.setItem(
                TOKEN_STORAGE,
                parsed.data.val.payload.token,
              );
            }
            get().addUser(parsed.data.val.payload.account);
            resolve({ error: false });
          });
          cloudlink.send({
            cmd: options.signUp ? "gen_account" : "authpswd",
            val: {
              username,
              pswd: password,
            },
            listener: "loginRequest",
          });
        });
      });
    },
    signOut: () => {
      localStorage.removeItem(USERNAME_STORAGE);
      localStorage.removeItem(TOKEN_STORAGE);
      set({ credentials: null });
      location.reload();
    },
  };
};
