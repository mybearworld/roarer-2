import { useShallow } from "zustand/react/shallow";
import { useAPI } from "../lib/api";
import { ProfilePicture } from "./ProfilePicture";
import { User } from "./User";

export const Ulist = () => {
  const [ulist, credentials] = useAPI(
    useShallow((state) => [state.ulist, state.credentials]),
  );

  return (
    <div>
      {credentials ? (
        <UlistUser username={credentials.username} you />
      ) : undefined}
      {ulist.map((user) =>
        user !== credentials?.username ? (
          <UlistUser key={user} username={user} />
        ) : undefined,
      )}
    </div>
  );
};

type UlistUserProps = {
  username: string;
  you?: boolean;
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
        <div>
          {props.username}{" "}
          {props.you ? <span className="text-sm">(You)</span> : undefined}
        </div>
      </button>
    </User>
  );
};
