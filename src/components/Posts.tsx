import { FormEvent, useState, useRef } from "react";
import { CirclePlus, Keyboard, SendHorizontal, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAPI } from "../lib/api";
import { trimmedPost } from "../lib/reply";
import { uploadFile } from "../lib/upload";
import { useShallow } from "zustand/react/shallow";
import { Button } from "./Button";
import { Textarea } from "./Input";
import { AttachmentView, Post } from "./Post";
import { Attachment } from "../lib/api/posts";

type Reply = {
  id: string;
  content: string;
  username: string;
};

export type PostsProps = {
  chat: string;
};
export const Posts = (props: PostsProps) => {
  const [reply, setReply] = useState<Reply>();
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string>();
  const [posts, loadChatPosts, loadMore] = useAPI(
    useShallow((state) => [
      state.chatPosts[props.chat],
      state.loadChatPosts,
      state.loadMore,
    ]),
  );
  loadChatPosts(props.chat);

  if (!posts) {
    return <>Loading posts...</>;
  }
  if (posts.error) {
    return (
      <div>
        <p className="font-bold">There was an error loading posts.</p>
        <p>{posts.message}</p>
      </div>
    );
  }

  const handleLoadMore = async () => {
    setLoadingMore(true);
    const response = await loadMore(props.chat);
    if (response.error) {
      setLoadMoreError(response.message);
    }
    setLoadingMore(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <EnterPost
        chat={props.chat}
        reply={reply}
        removeReply={() => setReply(undefined)}
      />
      <TypingIndicator chat={props.chat} />
      {posts.posts.map((post) => (
        <Post
          key={post}
          id={post}
          onReply={(id, content, username) =>
            setReply({ id, content, username })
          }
        />
      ))}
      <Button type="button" onClick={handleLoadMore} disabled={loadingMore}>
        Load more
      </Button>
      {loadMoreError ? (
        <div className="text-red-500">{loadMoreError}</div>
      ) : null}
    </div>
  );
};

export type TypingIndicatorProps = {
  chat: string;
};
const TypingIndicator = (props: TypingIndicatorProps) => {
  const [users, credentials] = useAPI(
    useShallow((state) => [state.typingUsers[props.chat], state.credentials]),
  );

  const filteredUsers = users?.filter((user) => user !== credentials?.username);
  const typing = filteredUsers && filteredUsers.length;

  return (
    <div
      className={twMerge(
        "flex items-center gap-2",
        typing ? "" : "text-gray-500 dark:text-gray-400",
      )}
    >
      <Keyboard
        className="h-5 min-h-5 w-5 min-w-5"
        aria-label="Typing users:"
      />
      {typing ? filteredUsers.join(", ") : "No one is currently typing."}
    </div>
  );
};

type EnterPostProps = {
  chat: string;
  reply?: Reply | undefined;
  removeReply?: () => void;
};
const EnterPost = (props: EnterPostProps) => {
  const [post, credentials, sendTyping] = useAPI(
    useShallow((state) => [state.post, state.credentials, state.sendTyping]),
  );
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState<"posting" | "writing" | "uploading">(
    "writing",
  );
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInput = useRef<HTMLInputElement | null>(null);

  if (!credentials) {
    return <></>;
  }

  const handlePost = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (state !== "writing") {
      return;
    }
    setState("posting");
    const response = await post(
      (props.reply
        ? `@${props.reply.username} ${trimmedPost(props.reply.content)} (${props.reply.id})\n`
        : "") + postContent,
      props.chat,
      attachments.map((attachment) => attachment.id),
    );
    if (response.error) {
      setError(response.message);
    }
    setState("writing");
    setPostContent("");
    setAttachments([]);
    setError("");
    props.removeReply?.();
  };

  const upload = async (files: FileList) => {
    const errors: string[] = [];
    setState("uploading");
    (
      await Promise.all(
        [...files].map(async (file) => {
          const uploadedFile = await uploadFile(file, "attachments");
          console.log(uploadedFile);
          if (uploadedFile.error) {
            return { type: "error", message: uploadedFile.message } as const;
          } else {
            return {
              type: "file",
              file: {
                filename: file.name,
                id: uploadedFile.response.id,
                mime: file.type,
                size: file.size,
              } satisfies Attachment,
            } as const;
          }
        }),
      )
    ).forEach((result) => {
      if (result.type === "error") {
        errors.push(result.message);
        return;
      }
      setAttachments((attachments) => [...attachments, result.file]);
    });
    if (errors.length) {
      setError(`Some files couldn't be uploaded. Errors: ${errors.join(",")}`);
    }
    setState("writing");
  };

  return (
    <form onSubmit={handlePost} className={twMerge("w-full")}>
      <Textarea
        value={postContent}
        onChange={(e) => setPostContent(e.currentTarget.value)}
        onInput={() => sendTyping(props.chat)}
        disabled={state !== "writing"}
        onEnter={handlePost}
        before={
          <>
            <button
              type="button"
              aria-label="Upload attachment"
              disabled={state !== "writing"}
              onClick={() => fileInput.current?.click()}
            >
              <input
                type="file"
                hidden
                multiple
                onInput={async (e) => {
                  const files = e.currentTarget.files;
                  if (!files) {
                    return;
                  }
                  await upload(files);
                  e.currentTarget.value = "";
                }}
                ref={fileInput}
              />
              <CirclePlus aria-hidden />
            </button>
          </>
        }
        after={
          <>
            <button
              type="submit"
              aria-label="Send"
              disabled={state !== "writing"}
            >
              <SendHorizontal aria-hidden />
            </button>
          </>
        }
        above={
          props.reply ? (
            <div className="flex gap-2">
              <div className="grow">
                <Post id={props.reply.id} reply="topLevel" />
              </div>
              <button
                type="button"
                aria-label="Remove reply"
                onClick={() => props.removeReply?.()}
              >
                <X aria-hidden />
              </button>
            </div>
          ) : undefined
        }
        below={
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <AttachmentView
                attachment={attachment}
                key={attachment.id}
                onRemove={(id) =>
                  setAttachments((attachments) =>
                    attachments.filter((attachment) => attachment.id !== id),
                  )
                }
              />
            ))}
          </div>
        }
        onPaste={(e) => {
          if (e.clipboardData.files.length) {
            upload(e.clipboardData.files);
          }
        }}
      />
      {error ? <span className="text-red-500">{error}</span> : undefined}
    </form>
  );
};
