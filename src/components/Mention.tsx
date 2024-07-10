import { useAPI } from "../lib/api";
import { twMerge } from "tailwind-merge";
import { ProfilePicture } from "./ProfilePicture";
import { User } from "./User";

export type MentionProps = {
  username: string;
};
export const Mention = (props: MentionProps) => {
  const credentials = useAPI((state) => state.credentials);

  return (
    <User username={props.username}>
      <button
        className={twMerge(
          "font-bold",
          props.username === credentials?.username
            ? "text-yellow-600"
            : "text-lime-600",
        )}
      >
        <span className="inline-block align-text-top">
          <ProfilePicture
            username={props.username}
            dontShowOnline
            size="w-5 h-5 min-w-5 min-h-5"
          />
        </span>
        &nbsp;
        <span>@{props.username}</span>
      </button>
    </User>
  );
};
