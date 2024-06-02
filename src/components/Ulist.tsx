import { useShallow } from "zustand/react/shallow";
import { useAPI } from "../lib/api";
import { ProfilePicture } from "./ProfilePicture";

export const Ulist = () => {
  const ulist = useAPI((state) => state.ulist);

  return (
    <div>
      {ulist.map((user) => (
        <UlistUser key={user} username={user} />
      ))}
    </div>
  );
};

type UlistUserProps = {
  username: string;
};
const UlistUser = (props: UlistUserProps) => {
  return (
    <button
      className="flex w-full items-center gap-2 bg-white px-2 py-1 hover:bg-gray-100"
      onClick={() => alert("not yet")}
    >
      <ProfilePicture
        className="inline-block h-8 min-h-8 w-8 min-w-8"
        username={props.username}
      />
      {props.username}
    </button>
  );
};
