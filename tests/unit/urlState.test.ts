import { describe, expect, it } from "vitest";
import { encodeFiltersToSearchParams, decodeFiltersFromSearchParams } from "@/lib/filters/urlState";

describe("url state", () => {
  it("encodes and decodes filters", () => {
    const encoded = encodeFiltersToSearchParams({ start: new Date("2024-01-01").toISOString(), end: new Date("2024-01-31").toISOString(), statuses: ["DELIVERED"], modes: ["TRUCK"], search: "LD" });
    const decoded = decodeFiltersFromSearchParams(encoded);
    expect(decoded.statuses).toEqual(["DELIVERED"]);
    expect(decoded.modes).toEqual(["TRUCK"]);
    expect(decoded.search).toBe("LD");
  });
});
