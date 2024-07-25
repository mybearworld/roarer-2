import { useState, ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { useAPI } from "../lib/api";
import { Button } from "./Button";
import { Popup } from "./Popup";
import { Markdown } from "./Markdown";
import { ProfilePicture } from "./ProfilePicture";
import { RelativeTime } from "./RelativeTime";
import { PERMISSIONS } from "../lib/permissions";

export type UserProps = {
  username: string;
  children: ReactNode;
  openInitially?: boolean;
};
export const User = (props: UserProps) => {
  const [credentials, user, loadUser, setOpenChat, getDM] = useAPI(
    useShallow((state) => [
      state.credentials,
      state.users[props.username],
      state.loadUser,
      state.setOpenChat,
      state.getDM,
    ]),
  );
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(props.openInitially ?? false);
  const [copiedUser, setCopiedUser] = useState(false);
  loadUser(props.username);

  const dm = async () => {
    const chat = await getDM(props.username);
    if (chat.error) {
      setError(chat.message);
      return;
    }
    setOpenChat(chat.chat);
    setOpen(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(
      `https://mybearworld.github.io/roarer-2?user=${encodeURIComponent(props.username)}`,
    );
    setCopiedUser(true);
    setTimeout(() => {
      setCopiedUser(false);
    }, 1000);
  };

  return (
    <Popup
      trigger={props.children}
      triggerAsChild
      controlled={{ open, onOpenChange: setOpen }}
    >
      {!user ?
        <div>Loading {props.username}...</div>
      : user.error ?
        <div>
          An error occured getting {props.username}!
          <br />
          Message: {user.message}
        </div>
      : <div className="flex gap-2">
          <div>
            <div className="flex items-center gap-4">
              <ProfilePicture username={props.username} />
              <div>
                <span className="text-xl font-bold">{props.username}</span>
                {user.created ?
                  <p className="text-sm italic opacity-60">
                    Joined <RelativeTime time={user.created} />
                  </p>
                : undefined}
              </div>
              {credentials && credentials.username !== props.username ?
                <div className="flex grow justify-end gap-2">
                  <Button type="button" onClick={dm}>
                    DM
                  </Button>
                  <button type="button" aria-label="Copy link" onClick={copy}>
                    {copiedUser ?
                      <Check className="h-5 w-5" aria-hidden />
                    : <Copy className="h-5 w-5" aria-hidden />}
                  </button>
                </div>
              : undefined}
            </div>
            <div className="mt-2 flex flex-col gap-2">
              {user.quote ?
                <Markdown children={user.quote} />
              : undefined}
              {user.permissions ?
                <Permissions permissions={user.permissions} />
              : undefined}
              {error ?
                <div className="text-red-500">{error}</div>
              : undefined}
            </div>
          </div>
        </div>
      }
    </Popup>
  );
};

type PermissionsProps = {
  permissions: number;
};
const Permissions = (props: PermissionsProps) => {
  return (
    <div>
      <p className="font-bold">Permissions:</p>
      <div className="rounded-xl bg-gray-100 dark:bg-gray-800">
        {PERMISSIONS.map((permission, index) =>
          (props.permissions & (1 << index)) !== 0 ?
            <div className="flex items-center gap-4 px-2 py-1">
              <permission.icon aria-hidden />
              <div className="flex flex-col">
                <p className="font-bold">{permission.name}</p>
                <p className="text-sm italic">{permission.description}</p>
              </div>
            </div>
          : undefined,
        )}
      </div>
    </div>
  );
};
