import { FormEvent, useState, useEffect, useRef } from "react";
import { CirclePlus, SendHorizontal, Smile, X } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useAPI } from "../lib/api";
import {
  userSyntaxForDiscordEmoji,
  userToRegularDiscordEmojiSyntax,
  DiscordEmoji,
} from "../lib/discordEmoji";
import { getImageSize } from "../lib/imageSize";
import { uploadFile } from "../lib/upload";
import { useShallow } from "zustand/react/shallow";
import { Textarea } from "./Input";
import { AttachmentView, Post } from "./Post";
import { Attachment } from "../lib/api/posts";
import { Checkbox } from "./Checkbox";
import { EmojiPicker } from "./EmojiPicker";
import { Markdown } from "./Markdown";
import { IconButton } from "./IconButton";

export type MarkdownInputProps = {
  chat?: string;
  replies?: string[];
  setReplies?: (replies: string[]) => void;
  value?: string;
  onSuccess?: () => void;
  disableWhenSending?: boolean;
  onSubmit: (
    postContent: string,
    replies: string[],
    attachments: string[],
  ) => Promise<{ error: true; message: string } | { error: false }>;
  attachments?: boolean;
};
export const MarkdownInput = (props: MarkdownInputProps) => {
  const replies = props.replies ?? [];

  const [credentials, sendTyping] = useAPI(
    useShallow((state) => [
      state.credentials,
      state.sendTyping,
      state.settings,
    ]),
  );
  const [postContent, setPostContent] = useState(props.value ?? "");
  const [error, setError] = useState("");
  const [state, setState] = useState<"posting" | "writing" | "uploading">(
    "writing",
  );
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [preview, setPreview] = useState(false);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const textArea = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    textArea.current?.focus?.();
  }, [props.replies]);
  useEffect(() => {
    setPostContent(props.value ?? "");
  }, [props.value]);

  if (!credentials) {
    return <></>;
  }

  const handlePost = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (state !== "writing" || !(attachments.length || postContent)) {
      return;
    }
    setState("posting");
    const response = await props.onSubmit(
      userToRegularDiscordEmojiSyntax(postContent),
      replies,
      attachments.map((attachment) => attachment.id),
    );
    setState("writing");
    if (response.error) {
      setError(response.message);
    } else {
      props.onSuccess?.();
      if (!props.value) {
        setPostContent("");
      }
      setAttachments([]);
      setError("");
      setPreview(false);
      props.setReplies?.([]);
    }
  };

  const handleEmoji = (emoji: DiscordEmoji | string) => {
    const stringEmoji =
      typeof emoji === "string" ? emoji : userSyntaxForDiscordEmoji(emoji);
    setPostContent((p) =>
      textArea.current ?
        p.slice(0, textArea.current.selectionStart) +
        stringEmoji +
        p.slice(textArea.current.selectionEnd)
      : p + stringEmoji,
    );
  };

  const showAttachments = props.attachments ?? true;

  const upload = async (files: FileList) => {
    const errors: string[] = [];
    setState("uploading");
    for (const file of files) {
      const uploadedFile = await uploadFile(file, "attachments");
      if (uploadedFile.error) {
        errors.push(uploadedFile.message);
        break;
      }
      const imageSize = await getImageSize(URL.createObjectURL(file));
      setAttachments((attachments) => [
        ...attachments,
        {
          filename: file.name,
          id: uploadedFile.response.id,
          mime: file.type,
          size: file.size,
          width: imageSize.width,
          height: imageSize.height,
        } satisfies Attachment,
      ]);
    }
    if (errors.length) {
      setError(`Some files couldn't be uploaded. Errors: ${errors.join(",")}`);
    }
    setState("writing");
  };

  return (
    <form onSubmit={handlePost} className={twMerge("w-full")}>
      <Textarea
        aria-label="Enter post"
        ref={textArea}
        value={postContent}
        onChange={(e) => setPostContent(e.currentTarget.value)}
        onInput={() => {
          if (props.chat) {
            sendTyping(props.chat);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            props.setReplies?.([]);
          }
        }}
        disabled={
          state === "uploading" ||
          ((props.disableWhenSending ?? true) && state === "posting")
        }
        onEnter={handlePost}
        before={
          <>
            {showAttachments ?
              <IconButton
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
              </IconButton>
            : undefined}
          </>
        }
        after={
          <div className="flex gap-2">
            <EmojiPicker
              onEmoji={handleEmoji}
              trigger={
                <IconButton
                  type="button"
                  aria-label="Pick an emoji"
                  disabled={state !== "writing"}
                >
                  <Smile aria-hidden />
                </IconButton>
              }
            />
            <IconButton
              type="submit"
              aria-label="Send"
              disabled={state !== "writing"}
            >
              <SendHorizontal aria-hidden />
            </IconButton>
          </div>
        }
        above={
          <div className="flex flex-col gap-2">
            {replies.map((reply, index) => (
              <div className="flex gap-2" key={index}>
                <div className="grow">
                  <Post id={reply} reply />
                </div>
                <button
                  type="button"
                  aria-label="Remove reply"
                  onClick={() =>
                    props.setReplies?.(
                      replies.slice(0, index).concat(replies.slice(index + 1)),
                    )
                  }
                >
                  <X aria-hidden />
                </button>
              </div>
            ))}
          </div>
        }
        below={
          <div>
            <div className="float-right">
              <label className="flex gap-2">
                <Checkbox checked={preview} onInput={setPreview} />
                <span>Preview</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <AttachmentView
                  attachment={attachment}
                  key={attachment.id}
                  onRemove={
                    preview ? undefined : (
                      (id) =>
                        setAttachments((attachments) =>
                          attachments.filter(
                            (attachment) => attachment.id !== id,
                          ),
                        )
                    )
                  }
                />
              ))}
            </div>
          </div>
        }
        replaceTextarea={
          preview ?
            <Markdown>{userToRegularDiscordEmojiSyntax(postContent)}</Markdown>
          : undefined
        }
        onPaste={(e) => {
          if (showAttachments && e.clipboardData.files.length) {
            upload(e.clipboardData.files);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (showAttachments && e.dataTransfer.files.length) {
            upload(e.dataTransfer.files);
          }
        }}
      />
      {error ?
        <span className="text-red-500">{error}</span>
      : undefined}
    </form>
  );
};
