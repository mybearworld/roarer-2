import { useAPI } from "../lib/api";
import { ProfilePicture } from "./ProfilePicture";
import { User } from "./User";

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
    <User username={props.username}>
      <button className="flex w-full items-center gap-2 bg-white px-2 py-1 hover:bg-gray-100">
        <ProfilePicture
          className="inline-block"
          username={props.username}
          size="h-8 min-h-8 w-8 min-w-8"
        />
        {props.username}
      </button>
    </User>
  );
};
