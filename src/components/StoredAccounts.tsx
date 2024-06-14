import { ReactNode } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";
import { Popup } from "./Popup";
import { ProfilePicture } from "./ProfilePicture";
import { useAPI } from "../lib/api";

export type StoredAccountsProps = {
  children: ReactNode;
};
export const StoredAccounts = (props: StoredAccountsProps) => {
  const [storedAccounts, credentials] = useAPI(
    useShallow((state) => [state.storedAccounts, state.credentials]),
  );
  const accountEntries = Object.entries(storedAccounts);
  return (
    <Popup trigger={props.children} triggerAsChild className="min-w-72">
      <p className="mx-2 text-lg font-bold">Choose an account</p>
      {credentials && credentials.username in storedAccounts ? (
        <StoredAccount {...credentials} isLoggedIn />
      ) : undefined}
      {accountEntries.length ? (
        accountEntries.map(([username, token]) =>
          credentials?.username !== username ? (
            <StoredAccount username={username} token={token} key={username} />
          ) : undefined,
        )
      ) : (
        <div className="mx-2">
          You currently do not have any stored accounts.
        </div>
      )}
    </Popup>
  );
};

type StoredAccountProps = {
  username: string;
  token: string;
  isLoggedIn?: boolean;
};
const StoredAccount = (props: StoredAccountProps) => {
  const [logIn, removeStoredAccount] = useAPI(
    useShallow((state) => [state.logIn, state.removeStoredAccount]),
  );
  return (
    <div className="flex">
      <button
        className={twMerge(
          "flex grow items-center gap-2 bg-white px-2 py-1 dark:bg-gray-900",
          props.isLoggedIn ? "" : "hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
        disabled={props.isLoggedIn}
        onClick={() =>
          logIn(props.username, props.token, {
            signUp: false,
            keepLoggedIn: true,
            storeAccount: true,
          })
        }
      >
        <ProfilePicture
          className="inline-block"
          username={props.username}
          size="h-8 min-h-8 w-8 min-w-8"
        />
        <div>
          {props.username}{" "}
          {props.isLoggedIn ? (
            <span className="text-sm">(Logged in)</span>
          ) : undefined}
        </div>
      </button>
      <button
        aria-label="Remove"
        className="bg-white px-2 py-1 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800"
        onClick={() => removeStoredAccount(props.username)}
      >
        <X aria-hidden />
      </button>
    </div>
  );
};
