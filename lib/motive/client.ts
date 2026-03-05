import { env } from "@/lib/env";

type QueryValue = string | number | undefined;

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function request<T>(path: string, query: Record<string, QueryValue> = {}, attempt = 0): Promise<T> {
  const url = new URL(path, env.MOTIVE_BASE_URL.endsWith("/") ? env.MOTIVE_BASE_URL : `${env.MOTIVE_BASE_URL}/`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": env.MOTIVE_API_KEY ?? ""
    },
    cache: "no-store"
  });

  if (response.ok) {
    return response.json();
  }

  if ((response.status === 429 || response.status >= 500) && attempt < 3) {
    const backoffMs = (attempt + 1) * 300;
    await sleep(backoffMs);
    return request(path, query, attempt + 1);
  }

  const body = await response.text();
  throw new Error(`Motive API ${response.status} for ${path}: ${body.slice(0, 500)}`);
}

const normalizeList = (payload: any): any[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
};

export async function fetchDispatches(params: { updatedAfter?: string; start?: string; end?: string }) {
  const payload = await request<any>("/v1/dispatches", {
    updated_after: params.updatedAfter,
    start: params.start,
    end: params.end,
    page_size: env.MOTIVE_PAGE_SIZE
  });
  return normalizeList(payload);
}

export async function fetchDispatchLocations() {
  const payload = await request<any>("/v1/dispatch_locations", { page_size: env.MOTIVE_PAGE_SIZE });
  return normalizeList(payload);
}

export async function fetchVehicles(params: { updatedAfter?: string }) {
  const payload = await request<any>("/v1/vehicles", {
    updated_after: params.updatedAfter,
    page_size: env.MOTIVE_PAGE_SIZE
  });
  return normalizeList(payload);
}
