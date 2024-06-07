import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";
import { useAPI } from "../lib/api";
import { profilePictures } from "../assets/pfp";

export const NO_PROFILE_PICTURE = {
  avatar: "",
  avatar_color: "",
  pfp_data: 500,
};

export type ProfilePictureProps = {
  username: string | undefined;
  className?: string;
  dontShowOnline?: boolean;
};
export const ProfilePicture = (props: ProfilePictureProps) => {
  const [user, loadUser, ulist] = useAPI(
    useShallow((state) => [
      props.username ? state.users[props.username] : undefined,
      state.loadUser,
      state.ulist,
    ]),
  );
  if (props.username) {
    loadUser(props.username);
  }

  return (
    <ProfilePictureBase
      pfp={user && !user.error ? user : NO_PROFILE_PICTURE}
      className={props.className}
      online={
        props.dontShowOnline ?? false
          ? false
          : props.username
            ? ulist.includes(props.username)
            : false
      }
    />
  );
};

export type ProfilePictureBaseProps = {
  pfp: {
    avatar: string;
    avatar_color: string;
    pfp_data: number | null;
  };
  className?: string;
  online?: boolean;
};
export const ProfilePictureBase = (props: ProfilePictureBaseProps) => {
  return (
    <div className="relative">
      <img
        className={twMerge(
          "h-10 min-h-10 w-10 min-w-10 rounded-lg border border-[--border-color] [border-style:--border-style]",
          props.className,
        )}
        style={
          {
            "--border-color": "#" + props.pfp.avatar_color,
            "--border-style":
              props.pfp.avatar && props.pfp.avatar_color !== "!color"
                ? "solid"
                : "none",
          } as CSSProperties
        }
        src={
          props.pfp.avatar
            ? `https://uploads.meower.org/icons/${props.pfp.avatar}`
            : profilePictures.get(props.pfp.pfp_data ?? 500)
        }
      />
      {props.online ? (
        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border border-green-600 bg-green-400" />
      ) : undefined}
    </div>
  );
};
