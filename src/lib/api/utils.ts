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

export type Errorable<T> =
  | (T & { error: false })
  | { error: true; message: string };
