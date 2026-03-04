import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildWhere } from "@/lib/db/queries";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  carrierId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.string().optional(),
  mode: z.string().optional()
});

export async function GET(req: NextRequest) {
  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const q = parsed.data;
  const where = buildWhere({
    start: new Date(q.start),
    end: new Date(q.end),
    carrierId: q.carrierId,
    customerId: q.customerId,
    status: q.status as any,
    mode: q.mode as any
  });

  const loads = await prisma.load.findMany({ where, include: { carrier: true } });
  const delivered = loads.filter((l) => l.status === "DELIVERED");
  const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
  const byDate = new Map<string, typeof loads>();
  for (const l of loads) {
    const d = l.dropoffPlannedAt.toISOString().slice(0, 10);
    byDate.set(d, [...(byDate.get(d) ?? []), l]);
  }
  const timeseries = [...byDate.entries()].map(([date, items]) => ({
    date,
    totalLoads: items.length,
    onTimeDropoffPct: items.length ? (items.filter((i) => i.dropoffActualAt && i.dropoffActualAt <= i.dropoffPlannedAt).length / items.length) * 100 : 0,
    avgCostPerMile: avg(items.map((i) => i.costUsd / Math.max(i.distanceMiles, 1)))
  }));

  return NextResponse.json({
    range: { start: q.start, end: q.end },
    kpis: {
      totalLoads: loads.length,
      deliveredLoads: delivered.length,
      onTimePickupPct: loads.length ? (loads.filter((l) => l.pickupActualAt && l.pickupActualAt <= l.pickupPlannedAt).length / loads.length) * 100 : 0,
      onTimeDropoffPct: loads.length ? (loads.filter((l) => l.dropoffActualAt && l.dropoffActualAt <= l.dropoffPlannedAt).length / loads.length) * 100 : 0,
      avgCostUsd: avg(loads.map((l) => l.costUsd)),
      avgCostPerMile: avg(loads.map((l) => l.costUsd / Math.max(l.distanceMiles, 1))),
      avgTransitHours: avg(loads.filter((l) => l.pickupActualAt && l.dropoffActualAt).map((l) => (l.dropoffActualAt!.getTime() - l.pickupActualAt!.getTime()) / 3600000))
    },
    timeseries,
    breakdowns: {
      byCarrier: Object.values(Object.groupBy(loads, (l) => l.carrierId)).slice(0, 10).map((grp) => ({
        carrierId: grp?.[0].carrierId,
        carrierName: grp?.[0].carrier.name,
        totalLoads: grp?.length ?? 0,
        onTimeDropoffPct: grp?.length ? (grp.filter((l) => l.dropoffActualAt && l.dropoffActualAt <= l.dropoffPlannedAt).length / grp.length) * 100 : 0,
        avgCostPerMile: avg((grp ?? []).map((l) => l.costUsd / Math.max(l.distanceMiles, 1)))
      })),
      byStatus: Object.entries(Object.groupBy(loads, (l) => l.status)).map(([status, vals]) => ({ status, totalLoads: vals?.length ?? 0 })),
      byMode: Object.entries(Object.groupBy(loads, (l) => l.mode)).map(([mode, vals]) => ({ mode, totalLoads: vals?.length ?? 0 }))
    }
  });
}
