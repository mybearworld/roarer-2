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
};
export const ProfilePicture = (props: ProfilePictureProps) => {
  const [user, loadUser] = useAPI(
    useShallow((state) => [
      props.username ? state.users[props.username] : undefined,
      state.loadUser,
    ]),
  );
  if (props.username) {
    loadUser(props.username);
  }

  return (
    <ProfilePictureBase
      pfp={user && !user.error ? user : NO_PROFILE_PICTURE}
      className={props.className}
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
};
export const ProfilePictureBase = (props: ProfilePictureBaseProps) => {
  return (
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
  );
};
