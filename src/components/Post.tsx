import { File } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAPI } from "../lib/api";
import { getReply } from "../lib/getReply";
import { Attachment, Post as APIPost } from "../lib/api/posts";
import { byteToHuman } from "../lib/byteToHuman";
import { Popup } from "./Popup";
import { ProfilePicture } from "./ProfilePicture";
import { twMerge } from "tailwind-merge";

export type PostProps = {
  id: string;
  reply?: boolean;
};
export const Post = (props: PostProps) => {
  const [post, loadPost] = useAPI(
    useShallow((state) => [state.posts[props.id], state.loadPost]),
  );
  if (post && !post.error && post.isDeleted) {
    return;
  }
  loadPost(props.id);

  return (
    <div className="flex gap-3">
      <div>
        <ProfilePicture
          className={props.reply ? "h-7 min-h-7 w-7 min-w-7" : ""}
          username={post?.error ? undefined : post?.u}
        />
      </div>
      <div
        className={twMerge(
          "relative min-w-0 grow break-words rounded-lg rounded-ss-none px-2 py-1",
          props.reply ? "bg-gray-200" : "bg-gray-100",
        )}
      >
        <div
          className={twMerge(
            "absolute left-[calc(-0.5rem-theme(spacing.2))] top-0 box-content h-0 w-0 border-[length:0.5rem] border-transparent border-r-gray-100",
            props.reply ? "border-r-gray-200" : "border-r-gray-100",
          )}
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
            <PostBase post={post} reply={props.reply} />
          )
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};

type PostBaseProps = {
  post: APIPost;
  reply?: boolean;
};
const PostBase = (props: PostBaseProps) => {
  const reply = getReply(props.post.p);
  const post = reply
    ? reply.id
      ? reply.postContent
      : reply.replyText + reply.postContent
    : props.post.p;

  return (
    <div
      className={twMerge(
        "flex",
        props.reply ? "flex-row items-center gap-2" : "flex-col",
      )}
    >
      <div className={twMerge("font-bold", props.reply ? "" : "text-sm")}>
        {props.post.u}
      </div>
      {!props.reply && reply?.id ? (
        <div className="mt-2">
          <Post id={reply.id} reply />
        </div>
      ) : undefined}
      <div>{post}</div>
      {!props.reply ? (
        <Attachments attachments={props.post.attachments} />
      ) : undefined}
    </div>
  );
};

type AttachmentsProps = {
  attachments: Attachment[];
};
const Attachments = (props: AttachmentsProps) => {
  if (!props.attachments.length) {
    return;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {props.attachments.map((attachment) => (
        <AttachmentView key={attachment.id} attachment={attachment} />
      ))}
    </div>
  );
};

type AttachmentProps = {
  attachment: Attachment;
};
const AttachmentView = (props: AttachmentProps) => {
  const download = useRef<HTMLAnchorElement>(null);

  if (props.attachment.mime.startsWith("image/")) {
    return (
      <Popup
        trigger={
          <img
            key={props.attachment.id}
            className="h-36 w-36 rounded-xl object-cover"
            src={`https://uploads.meower.org/attachments/${props.attachment.id}/${props.attachment.filename}?preview`}
            alt={props.attachment.filename}
            title={props.attachment.filename}
            width={props.attachment.width}
            height={props.attachment.height}
          />
        }
      >
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Dialog.Title className="grow text-xl font-bold">
              {props.attachment.filename}
            </Dialog.Title>
          </div>
          <img
            src={`https://uploads.meower.org/attachments/${props.attachment.id}/${props.attachment.filename}`}
            alt={props.attachment.filename}
            title={props.attachment.filename}
            width={props.attachment.width}
            height={props.attachment.height}
          />
        </div>
      </Popup>
    );
  }

  return (
    <>
      <a ref={download} download={props.attachment.filename} hidden />
      <button
        onClick={async () => {
          const url = URL.createObjectURL(
            await (
              await fetch(
                `https://uploads.meower.org/attachments/${props.attachment.id}/${props.attachment.filename}`,
              )
            ).blob(),
          );
          if (!download.current) {
            return;
          }
          download.current.href = url;
          download.current.click();
        }}
        type="button"
        className="flex h-36 w-36 flex-col items-center justify-center gap-2 rounded-xl bg-lime-200 px-2 py-1 text-center"
      >
        <File className="h-14 w-14" strokeWidth={1.25} />
        <div>
          <div className="text-sm font-bold">{props.attachment.filename}</div>
          <div className="text-sm">({byteToHuman(props.attachment.size)})</div>
        </div>
      </button>
    </>
  );
};
