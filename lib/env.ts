import { z } from "zod";

const boolFromString = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

const serverSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    AUTH_ENABLED: boolFromString.default(false),
    NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),
    NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
    DEMO_USER_EMAIL: z.string().email("DEMO_USER_EMAIL must be a valid email"),
    DEMO_USER_PASSWORD: z.string().min(1, "DEMO_USER_PASSWORD is required"),
    NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional().transform((v) => v?.trim() || undefined),
    SENTRY_DSN: z.string().url("SENTRY_DSN must be a valid URL").optional().or(z.literal("")),
    SENTRY_ENVIRONMENT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    MOTIVE_ENABLED: boolFromString.default(false),
    MOTIVE_BASE_URL: z.string().url("MOTIVE_BASE_URL must be a valid URL").default("https://api.gomotive.com"),
    MOTIVE_API_KEY: z.string().optional().transform((v) => v?.trim() || undefined),
    MOTIVE_SYNC_LOOKBACK_DAYS: z.coerce.number().int().positive().default(90),
    MOTIVE_PAGE_SIZE: z.coerce.number().int().positive().max(500).default(100)
  })
  .superRefine((value, ctx) => {
    if (value.MOTIVE_ENABLED && !value.MOTIVE_API_KEY) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["MOTIVE_API_KEY"], message: "MOTIVE_API_KEY is required when MOTIVE_ENABLED=true" });
    }
    if (value.AUTH_ENABLED && !value.NEXTAUTH_URL) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["NEXTAUTH_URL"], message: "NEXTAUTH_URL is required when AUTH_ENABLED=true" });
    }
  });

const parsed = serverSchema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`).join("\n");
  throw new Error(`Invalid environment configuration:\n${details}`);
}

export const env = parsed.data;

if (env.NODE_ENV === "development") {
  const warnings: string[] = [];
  if (!env.NEXT_PUBLIC_MAPBOX_TOKEN) warnings.push("NEXT_PUBLIC_MAPBOX_TOKEN is not set. Using Leaflet/OSM fallback.");
  if (!env.SENTRY_DSN) warnings.push("SENTRY_DSN is not set. Error reporting is disabled.");
  if (!env.MOTIVE_ENABLED) warnings.push("MOTIVE_ENABLED=false. Using seeded demo data unless a sync is run.");
  if (warnings.length) {
    console.warn(`[env] Optional integrations not configured:\n${warnings.map((w) => `  - ${w}`).join("\n")}`);
  }
}
