import { useAPI } from "../lib/api";
import { useShallow } from "zustand/react/shallow";
import { Post } from "./Post";

export const Posts = () => {
  const [home, loadChatPosts] = useAPI(
    useShallow((state) => [state.chatPosts.home, state.loadChatPosts]),
  );
  loadChatPosts("home");

  if (!home) {
    return <>Loading post...</>;
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
