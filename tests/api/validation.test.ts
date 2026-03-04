import { describe, it, expect } from "vitest";

describe("api validation", () => {
  it("metrics requires ISO dates", async () => {
    const { GET } = await import("@/app/api/metrics/route");
    const req = new Request("http://localhost/api/metrics?start=nope&end=nope");
    const res = await GET(req as any);
    expect(res.status).toBe(400);
  });

  it("loads requires ISO dates", async () => {
    const { GET } = await import("@/app/api/loads/route");
    const req = { nextUrl: { searchParams: new URLSearchParams({ start: "nope", end: "nope" }) } };
    const res = await GET(req as any);
    expect(res.status).toBe(400);
  });
});
