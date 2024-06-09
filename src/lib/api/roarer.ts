import { Slice } from ".";

export type RoarerSlice = {
  openChat: string;
  setOpenChat: (openChat: string) => void;
};
export const createRoarerSlice: Slice<RoarerSlice> = (set) => {
  return {
    openChat: "home",
    setOpenChat: (openChat: string) => {
      set({ openChat });
    },
  };
};
