import { z, ZodSchema } from "zod";

export const orError = <TSchema extends ZodSchema>(schema: TSchema) => {
  return schema.and(z.object({ error: z.literal(false) })).or(
    z.object({
      error: z.literal(true),
      type: z.string(),
    }),
  );
};
