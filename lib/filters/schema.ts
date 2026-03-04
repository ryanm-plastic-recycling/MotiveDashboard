import { z } from "zod";

export const dashboardFilterSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  search: z.string().optional(),
  carrierIds: z.array(z.string()).optional(),
  customerIds: z.array(z.string()).optional(),
  statuses: z.array(z.string()).optional(),
  modes: z.array(z.string()).optional(),
  bbox: z.string().optional(),
  mapBoundsOnly: z.boolean().optional()
});
