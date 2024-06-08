import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";
import { ChevronRight } from "lucide-react";
import { useAPI } from "../lib/api";

export type ChatsProps = {
  onChatClick: (chat: string) => void;
  currentChat: string;
};
export const Chats = (props: ChatsProps) => {
  const [chats, userChats, credentials] = useAPI(
    useShallow((store) => [store.chats, store.userChats, store.credentials]),
  );

  if (!credentials) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-lg font-bold">No chats yet!</p>
        <p>Sign into Meower to join chats and message users.</p>
      </div>
    );
  }
  if (!userChats) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        Loading...
      </div>
    );
  }
  if (userChats.error) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-lg font-bold">
          There was an error loading your chats.
        </p>
        <p>{userChats.message}</p>
      </div>
    );
  }
  if (userChats.chats.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="text-lg font-bold">No chats yet!</p>
        <p>
          Ask someone on a better client than this to add you to one or to DM
          you.
        </p>
      </div>
    );
  }

  const lastActive = (id: string) => {
    const chat = chats[id];
    if (chat === undefined || chat.error || chat.deleted) {
      return 0;
    }
    return chat.last_active;
  };
  const sortedChats = [...userChats.chats].sort(
    (a, b) => lastActive(b) - lastActive(a),
  );

  return (
    <div className="max-w-full">
      <Chat
        chat="home"
        onClick={props.onChatClick}
        current={props.currentChat === "home"}
      />
      {sortedChats.map((chat) => (
        <Chat
          key={chat}
          chat={chat}
          onClick={props.onChatClick}
          current={props.currentChat === chat}
        />
      ))}
    </div>
  );
};

type ChatProps = {
  chat: string;
  onClick: (id: string) => void;
  current: boolean;
};
const Chat = (props: ChatProps) => {
  const [credentials, baseChat, loadChat] = useAPI(
    useShallow((state) => [
      state.credentials,
      state.chats[props.chat],
      state.loadChat,
    ]),
  );
  if (props.chat !== "home") {
    loadChat(props.chat);
  }

  const chat = props.chat === "home" ? "home" : baseChat;

  if (chat !== "home" && !chat) {
    return <>Loading chat...</>;
  }
  if (chat !== "home" && chat.error) {
    return (
      <div>
        <p>There was an error loading this chat.</p>
        <p>{chat.message}</p>
      </div>
    );
  }
  if (chat !== "home" && chat.deleted) {
    return <></>;
  }

  const isDM = chat !== "home" && !chat.owner;

  return (
    <button
      className={twMerge(
        "flex w-full max-w-full items-center px-2 py-1 text-left",
        props.current
          ? "bg-gray-100 dark:bg-gray-900"
          : "bg-white hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900",
      )}
      type="button"
      onClick={() => {
        props.onClick(props.chat);
      }}
    >
      <div className="min-w-0 grow">
        <div className="font-bold">
          {isDM
            ? `@${chat.members.find((member) => member !== credentials?.username)}`
            : chat === "home"
              ? "Home"
              : chat.nickname}
        </div>
        <div className="line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
          {!isDM && chat !== "home" ? chat.members.join(", ") : undefined}
        </div>
      </div>
      <ChevronRight className="w-7 min-w-7" />
    </button>
  );
};
