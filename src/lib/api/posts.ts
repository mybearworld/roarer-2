import { z } from "zod";
import { StateCreator } from "zustand";
import { Store } from ".";
import { getCloudlink } from "./cloudlink";
import { Errorable, loadMore, request } from "./utils";

export type Attachment = Omit<
  z.infer<typeof ATTACHMENT_SCHEMA>,
  "height" | "width"
> & { width?: number; height?: number };
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

const POST_DELETE_PACKET_SCHEMA = z.object({
  cmd: z.literal("direct"),
  val: z.object({
    mode: z.literal("delete"),
    id: z.string(),
  }),
});
const MORE_POSTS_SCHEMA = z.object({
  autoget: POST_SCHEMA.array(),
  pages: z.number(),
});
const POST_PACKET_SCHEMA = z.object({
  cmd: z.literal("direct"),
  val: POST_SCHEMA,
});

export type PostsSlice = {
  chatPosts: Record<
    string,
    Errorable<{ posts: string[]; stopLoadingMore: boolean }>
  >;
  posts: Record<string, Errorable<Post | { isDeleted: true }>>;
  addPost: (post: Post) => void;
  loadChatPosts: (id: string) => Promise<boolean>;
  loadPosts: (
    id: string,
    current: number,
  ) => Promise<
    | { error: true; message: string }
    | { error: false; posts: string[]; stop: boolean }
  >;
  loadPost: (id: string) => Promise<void>;
  post: (
    content: string,
    chat: string,
    attachments?: string[],
  ) => Promise<{ error: true; message: string } | { error: false }>;
};
export const createPostsSlice: StateCreator<Store, [], [], PostsSlice> = (
  set,
  get,
) => {
  getCloudlink().then((cloudlink) => {
    cloudlink.on("direct", async (packet: unknown) => {
      const parsed = POST_PACKET_SCHEMA.safeParse(packet);
      if (!parsed.success) {
        return;
      }
      const post = parsed.data.val;
      const state = get();
      const hasLoaded = await state.loadChatPosts(post.post_origin);
      if (hasLoaded) {
        return;
      }
      state.addPost(post);
      set((state) => {
        const chatPosts = state.chatPosts[post.post_origin];
        if (!chatPosts || chatPosts.error) {
          return {};
        }
        return {
          chatPosts: {
            ...state.chatPosts,
            [post.post_origin]: {
              ...chatPosts,
              posts: [post.post_id, ...chatPosts.posts],
            },
          },
        };
      });
      set((state) => {
        if (post.post_origin === "home") {
          return {};
        }
        const chat = state.chats[post.post_origin];
        if (!chat) {
          return {};
        }
        return {
          chats: {
            ...state.chats,
            [post.post_origin]: {
              ...chat,
              last_active: Date.now() / 1000,
            },
          },
        };
      });
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

  const loadingPosts = new Set<string>();
  const loadingChats = new Set<string>();
  return {
    posts: {},
    chatPosts: {},
    addPost: (post: Post) => {
      set((state) => ({
        posts: {
          ...state.posts,
          [post.post_id]: { ...post, error: false },
        },
      }));
    },
    loadPost: async (post: string) => {
      if (post in get().posts || loadingPosts.has(post)) {
        return;
      }
      loadingPosts.add(post);
      const response = await request(
        fetch(`https://api.meower.org/posts?id=${encodeURIComponent(post)}`),
        POST_SCHEMA,
      );
      set((state) => ({
        posts: {
          ...state.posts,
          [post]: response.error
            ? { error: true, message: response.message }
            : { error: false, ...response.response },
        },
      }));
      loadingPosts.delete(post);
    },
    loadChatPosts: async (id: string) => {
      const state = get();
      if (state.chatPosts[id]) {
        return false;
      }
      if (loadingChats.has(id)) {
        return false;
      }
      loadingChats.add(id);
      const response = await state.loadPosts(id, 0);
      set((state) => ({
        chatPosts: {
          ...state.chatPosts,
          [id]: response.error
            ? { error: true, message: response.message }
            : {
                posts: response.posts,
                stopLoadingMore: response.stop,
                error: false,
              },
        },
      }));
      loadingChats.delete(id);
      return true;
    },
    loadPosts: async (id: string, current: number) => {
      const state = get();
      const { page, remove } = loadMore(current);
      const response = await request(
        fetch(
          `https://api.meower.org/${id === "home" ? "home" : `posts/${encodeURIComponent(id)}`}?page=${page}`,
          {
            headers: state.credentials
              ? { Token: state.credentials.token }
              : {},
          },
        ),
        MORE_POSTS_SCHEMA,
      );
      if (response.error) {
        return { error: true, message: response.message };
      }
      const posts = response.response.autoget.slice(0, remove);
      posts.forEach((post) => {
        state.addPost(post);
      });
      return {
        error: false,
        posts: posts.map((post) => post.post_id),
        stop: page === response.response.pages,
      };
    },
    post: async (content, chat, attachments) => {
      const state = get();
      const response = await request(
        fetch(
          `https://api.meower.org/${chat === "home" ? "home" : `posts/${encodeURIComponent(chat)}`}`,
          {
            headers: {
              ...(state.credentials ? { Token: state.credentials.token } : {}),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, attachments }),
            method: "POST",
          },
        ),
        POST_SCHEMA,
      );
      if (response.error) {
        return { error: true, message: response.message };
      }
      return { error: false };
    },
  };
};
