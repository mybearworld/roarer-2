import { StateCreator } from "zustand";
import { Store } from ".";

export type RoarerSlice = {
  openChat: string;
  setOpenChat: (openChat: string) => void;
};
export const createRoarerSlice: StateCreator<Store, [], [], RoarerSlice> = (
  set,
) => {
  return {
    openChat: "home",
    setOpenChat: (openChat: string) => {
      set({ openChat });
    },
  };
};
