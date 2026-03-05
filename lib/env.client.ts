import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional().transform((v) => v?.trim() || undefined)
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN
});
