import { env } from "@/lib/env";

export function initSentry() {
  if (!env.SENTRY_DSN) return;
}
