import { File } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { useAPI } from "../lib/api";
import { Attachment, Post as APIPost } from "../lib/api/posts";
import { byteToHuman } from "../lib/byteToHuman";
import { Popup } from "./Popup";
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
      <div className="relative min-w-0 grow break-words rounded-lg rounded-ss-none bg-gray-100 px-2 py-1">
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
            <PostBase post={post} />
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
};
const PostBase = (props: PostBaseProps) => {
  return (
    <>
      <div className="text-sm font-bold">{props.post.u}</div>
      <div>{props.post.p}</div>
      <Attachments attachments={props.post.attachments} />
    </>
  );
};

type AttachmentsProps = {
  attachments: Attachment[];
};
const Attachments = (props: AttachmentsProps) => {
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
