import { KeyboardEvent, FormEvent, useState, useRef } from "react";
import { CirclePlus, SendHorizontal, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAPI } from "../lib/api";
import { trimmedPost } from "../lib/reply";
import { uploadFile } from "../lib/upload";
import { useShallow } from "zustand/react/shallow";
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
      <EnterPost
        chat={props.chat}
        reply={reply}
        removeReply={() => setReply(undefined)}
      />
      {home.posts.map((post) => (
        <Post
          key={post}
          id={post}
          onReply={(id, content, username) =>
            setReply({ id, content, username })
          }
        />
      ))}
    </div>
  );
};

export type EnterPostProps = {
  chat: string;
  reply?: Reply | undefined;
  removeReply?: () => void;
};
const EnterPost = (props: EnterPostProps) => {
  const [post, credentials] = useAPI(
    useShallow((state) => [state.post, state.credentials]),
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
    props.removeReply?.();
  };

  const handleInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
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
        onKeyDown={handleInput}
        disabled={state !== "writing"}
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
                <Post id={props.reply.id} reply />
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
