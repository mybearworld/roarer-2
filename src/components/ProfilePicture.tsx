import { CSSProperties } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAPI } from "../lib/api";
import { profilePictures } from "../assets/pfp";

export type ProfilePictureProps = {
  username: string | undefined;
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
      pfp={
        user && !user.error
          ? user
          : { avatar: "", avatar_color: "", pfp_data: 500 }
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
};
export const ProfilePictureBase = (props: ProfilePictureBaseProps) => {
  return (
    <img
      className="h-10 w-10 rounded-lg border border-[--border-color] [border-style:--border-style]"
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
