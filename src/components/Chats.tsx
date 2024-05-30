import { useShallow } from "zustand/react/shallow";
import { ChevronRight } from "lucide-react";
import { useAPI } from "../lib/api";

export const Chats = () => {
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
    <div>
      {sortedChats.map((chat) => (
        <Chat key={chat} chat={chat} />
      ))}
    </div>
  );
};

type ChatProps = {
  chat: string;
};
const Chat = (props: ChatProps) => {
  const [credentials, chat, loadChat] = useAPI(
    useShallow((state) => [
      state.credentials,
      state.chats[props.chat],
      state.loadChat,
    ]),
  );
  loadChat(props.chat);

  if (!chat) {
    return <>Loading chat...</>;
  }
  if (chat.error) {
    return (
      <div>
        <p>There was an error loading this chat.</p>
        <p>{chat.message}</p>
      </div>
    );
  }
  if (chat.deleted) {
    return <></>;
  }

  const isDM = !chat.owner;

  return (
    <button
      className="flex w-full items-center px-2 py-1 text-left hover:bg-gray-100"
      type="button"
    >
      <div className="grow">
        <div className="font-bold">
          {isDM
            ? chat.members.find((member) => member !== credentials?.username)
            : chat.nickname}
        </div>
        <p className="line-clamp-1">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit sed
          maxime perspiciatis tempore nam rem corporis recusandae sapiente
          excepturi ratione, id, voluptatum rerum facilis itaque temporibus.
        </p>
      </div>
      <ChevronRight className="min-w-5" />
    </button>
  );
};
