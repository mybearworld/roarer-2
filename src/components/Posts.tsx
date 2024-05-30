import { useAPI } from "../lib/api";
import { useShallow } from "zustand/react/shallow";
import { Post } from "./Post";

export type PostProps = {
  chat: string;
};
export const Posts = (props: PostProps) => {
  const [home, loadChatPosts] = useAPI(
    useShallow((state) => [state.chatPosts[props.chat], state.loadChatPosts]),
  );
  loadChatPosts(props.chat);

  if (!home) {
    return <>Loading posts...</>;
  }
  if (home.error) {
    return (
      <div>
        <p className="font-bold">There was an error loading posts.</p>
        <p>{home.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {home.posts.map((post) => (
        <Post key={post} id={post} />
      ))}
    </div>
  );
};
