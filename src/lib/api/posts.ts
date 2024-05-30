import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { getCloudlink } from "./cloudlink";
import { Errorable, loadMore, orError } from "./utils";

export type Attachment = z.infer<typeof ATTACHMENT_SCHEMA>;
const ATTACHMENT_SCHEMA = z.object({
  filename: z.string(),
  height: z.number(),
  id: z.string(),
  mime: z.string(),
  size: z.number(),
  width: z.number(),
});

export type Post = z.infer<typeof POST_SCHEMA>;
export const POST_SCHEMA = z.object({
  attachments: ATTACHMENT_SCHEMA.array(),
  edited_at: z.number().optional(),
  isDeleted: z.literal(false),
  p: z.string(),
  post_id: z.string(),
  post_origin: z.string(),
  t: z.object({
    e: z.number(),
  }),
  type: z.number(),
  u: z.string(),
});

const POST_PACKET_SCHEMA = z.object({
  cmd: z.literal("direct"),
  val: POST_SCHEMA,
});
const POST_DELETE_PACKET_SCHEMA = z.object({
  cmd: z.literal("direct"),
  val: z.object({
    mode: z.literal("delete"),
    id: z.string(),
  }),
});

export type PostsSlice = {
  home: string[];
  posts: Record<string, Errorable<Post | { isDeleted: true }>>;
  addPost: (post: Post) => void;
  loadMore: () => Promise<{ error: true; message: string } | { error: false }>;
};
export const createPostsSlice: StateCreator<Store, [], [], PostsSlice> = (
  set,
  get,
) => {
  getCloudlink().then((cloudlink) => {
    cloudlink.on("direct", (packet: unknown) => {
      const parsed = POST_PACKET_SCHEMA.safeParse(packet);
      if (!parsed.success) {
        return;
      }
      const post = parsed.data.val;
      if (post.post_origin === "home") {
        const state = get();
        state.addPost(post);
        set((state) => ({
          home: [post.post_id, ...state.home],
        }));
      }
    });
    cloudlink.on("direct", (packet: unknown) => {
      const parsed = POST_DELETE_PACKET_SCHEMA.safeParse(packet);
      if (!parsed.success) {
        return;
      }
      set((state) => ({
        posts: {
          ...state.posts,
          [parsed.data.val.id]: { isDeleted: true, error: false },
        },
      }));
    });
  });

  return {
    home: [],
    posts: {},
    addPost: (post: Post) => {
      set((state) => ({
        posts: {
          ...state.posts,
          [post.post_id]: { ...post, error: false },
        },
      }));
    },
    loadMore: async () => {
      const { page, remove } = loadMore(get().home.length);
      const response = orError(
        z.object({ autoget: POST_SCHEMA.array() }),
      ).parse(
        await (
          await fetch(`https://api.meower.org/home?autoget=1&page=${page}`)
        ).json(),
      );
      if (response.error) {
        return { error: true, message: response.type };
      }
      const state = get();
      const posts = response.autoget.slice(0, remove);
      posts.forEach((post) => {
        state.addPost(post);
      });
      set((state) => ({
        home: [...posts.map((post) => post.post_id), ...state.home],
      }));
      return { error: false };
    },
  };
};
