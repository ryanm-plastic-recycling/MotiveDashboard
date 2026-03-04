import { DashboardFilters } from "./types";

const arr = (v?: string[]) => (v?.length ? v.join(",") : "");
const parseArr = (v: string | null) => (v ? v.split(",").filter(Boolean) : undefined);

export function encodeFiltersToSearchParams(filters: DashboardFilters): URLSearchParams {
  const p = new URLSearchParams();
  Object.entries({
    start: filters.start,
    end: filters.end,
    search: filters.search,
    carrierIds: arr(filters.carrierIds),
    customerIds: arr(filters.customerIds),
    statuses: arr(filters.statuses),
    modes: arr(filters.modes),
    bbox: filters.bbox,
    mapBoundsOnly: filters.mapBoundsOnly ? "1" : ""
  }).forEach(([k, v]) => v && p.set(k, v));
  return p;
}

export function decodeFiltersFromSearchParams(p: URLSearchParams): DashboardFilters {
  return {
    start: p.get("start") ?? new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    end: p.get("end") ?? new Date().toISOString(),
    search: p.get("search") ?? undefined,
    carrierIds: parseArr(p.get("carrierIds")),
    customerIds: parseArr(p.get("customerIds")),
    statuses: parseArr(p.get("statuses")),
    modes: parseArr(p.get("modes")),
    bbox: p.get("bbox") ?? undefined,
    mapBoundsOnly: p.get("mapBoundsOnly") === "1"
  };
}
