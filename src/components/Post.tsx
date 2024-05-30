import { useAPI } from "../lib/api";
import { ProfilePicture } from "./ProfilePicture";

export type PostProps = {
  id: string;
};
export const Post = (props: PostProps) => {
  const post = useAPI((state) => state.posts[props.id]);
  if (post && !post.error && post.isDeleted) {
    return;
  }

  return (
    <div className="flex gap-3">
      <div>
        <ProfilePicture username={post?.error ? undefined : post?.u} />
      </div>
      <div className="relative grow rounded-lg rounded-ss-none bg-gray-100 px-2 py-1">
        <div
          className="absolute left-[calc(-0.5rem-theme(spacing.2))] top-0 box-content h-0 w-0 border-[length:0.5rem] border-transparent border-r-gray-100"
          aria-hidden
        />
        {post ? (
          post.error ? (
            <>
              There was an error loading this post.
              <br />
              Message: {post.message}
            </>
          ) : (
            <>
              <div className="text-sm font-bold">{post.u}</div>
              <div>{post.p}</div>
            </>
          )
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};
