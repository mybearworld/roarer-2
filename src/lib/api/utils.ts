import { z, ZodSchema } from "zod";

export const orError = <TSchema extends ZodSchema>(schema: TSchema) => {
  return schema.and(z.object({ error: z.literal(false) })).or(
    z.object({
      error: z.literal(true),
      type: z.string(),
    }),
  );
};

const PER_PAGE = 25;
export const loadMore = (amount: number) => {
  const page = Math.floor(amount / PER_PAGE) + 1;
  const remove = PER_PAGE - (amount % PER_PAGE);
  return { page, remove };
};

export type BuildLoadOptions<TSchema extends ZodSchema> = {
  url: (id: string) => string;
  schema: TSchema;
  alreadyLoaded: (id: string) => boolean;
  onError: (id: string, msg: string) => void;
  onSuccess: (item: z.infer<TSchema>) => void;
};
export const buildLoad = <TSchema extends ZodSchema>(
  options: BuildLoadOptions<TSchema>,
) => {
  const loading = new Set();
  return async (id: string) => {
    if (loading.has(id) || options.alreadyLoaded(id)) {
      return;
    }
    loading.add(id);
    const response = orError(options.schema).safeParse(
      await (await fetch(options.url(id))).json(),
    );
    if (response.error) {
      options.onError(id, "schema");
      return;
    }
    if ("error" in response.data && response.data.error) {
      options.onError(id, response.data.type);
      return;
    }
    options.onSuccess(response.data);
  };
};

export type Errorable<T> =
  | (T & { error: false })
  | { error: true; message: string };
