import { useAPI } from "../lib/api";
import { twMerge } from "tailwind-merge";
import { ProfilePicture } from "./ProfilePicture";
import { User } from "./User";
import { Username } from "./Username";
import { UserColor } from "./UserColor";

export type MentionProps = {
  username: string;
  pfp?: boolean;
};
export const Mention = (props: MentionProps) => {
  const credentials = useAPI((state) => state.credentials);

  return (
    <User username={props.username}>
      <button
        className={twMerge(
          "inline-flex items-center gap-1 align-top font-bold",
          props.username === credentials?.username ?
            "[--fallback:theme(colors.yellow.600)]"
          : "[--fallback:theme(text-lime-600)]",
        )}
      >
        <span className="inline-block align-text-top">
          {(props.pfp ?? true) ?
            <ProfilePicture
              username={props.username}
              dontShowOnline
              size="w-5 h-5 min-w-5 min-h-5"
            />
          : undefined}
        </span>
        <span className="inline-block">
          <span className="sr-only">@</span>
          <UserColor username={props.username}>
            <Username username={props.username} />
          </UserColor>
        </span>
      </button>
    </User>
  );
};
