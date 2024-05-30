import { useAPI } from "../lib/api";
import { Post } from "./Post";

export const Posts = () => {
  const home = useAPI((state) => state.home);
  return (
    <div className="flex flex-col gap-2">
      {home.map((post) => (
        <Post key={post} id={post} />
      ))}
    </div>
  );
};
