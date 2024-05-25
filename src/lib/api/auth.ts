import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { getCloudlink } from "./cloudlink";

const AUTH_RESPONSE = z
  .object({
    cmd: z.literal("direct"),
    listener: z.literal("loginRequest"),
    val: z.object({
      mode: z.literal("auth"),
      payload: z.object({
        account: z.unknown(), // todo
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

export type AuthSlice = {
  credentials: {
    username: string;
    token: string;
  } | null;
  logIn: (
    username: string,
    password: string,
  ) => Promise<{ error: true; message: string } | { error: false }>;
};
export const createAuthSlice: StateCreator<Store, [], [], AuthSlice> = (
  set,
  _get,
) => {
  return {
    credentials: null,
    logIn: (username, password) => {
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
            resolve({ error: false });
          });
          cloudlink.send({
            cmd: "authpswd",
            val: {
              username,
              pswd: password,
            },
            listener: "loginRequest",
          });
        });
      });
    },
  };
};
