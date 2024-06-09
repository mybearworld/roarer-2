import { Slice } from ".";
import { getCloudlink } from "./cloudlink";

export type UlistSlice = {
  ulist: string[];
};
export const createUlistSlice: Slice<UlistSlice> = (set) => {
  getCloudlink().then((cloudlink) => {
    const updateUlist = () => {
      const ulist = cloudlink.ulist as string | undefined;
      if (!ulist) {
        return;
      }
      set({
        ulist: ulist.split(";").slice(0, -1).sort(),
      });
    };
    updateUlist();
    cloudlink.on("ulist", updateUlist);
  });
  return {
    ulist: [],
  };
};
