import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildWhere, getLoads } from "@/lib/db/queries";
import { LoadStatus, TransportMode } from "@prisma/client";
import { logger } from "@/lib/observability/logger";

const schema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  search: z.string().optional(),
  carrierId: z.string().optional(),
  customerId: z.string().optional(),
  status: z.nativeEnum(LoadStatus).optional(),
  mode: z.nativeEnum(TransportMode).optional(),
  page: z.coerce.number().default(1),
  pageSize: z.coerce.number().default(25),
  sort: z.enum(["dropoffPlannedAt", "pickupPlannedAt", "costUsd", "distanceMiles"]).default("dropoffPlannedAt"),
  dir: z.enum(["asc", "desc"]).default("desc")
});

export async function GET(req: NextRequest) {
  logger.time("api-loads");
  const parsed = schema.safeParse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const q = parsed.data;
  const { total, loads } = await getLoads(buildWhere({ ...q, start: new Date(q.start), end: new Date(q.end) }), q.page, q.pageSize, { [q.sort]: q.dir });
  logger.timeEnd("api-loads");
  return NextResponse.json({
    page: q.page,
    pageSize: q.pageSize,
    total,
    rows: loads.map((l) => ({
      id: l.id,
      reference: l.reference,
      status: l.status,
      mode: l.mode,
      carrierName: l.carrier.name,
      customerName: l.customer.name,
      pickup: { plannedAt: l.pickupPlannedAt, actualAt: l.pickupActualAt, locationName: l.pickupLocation.name, lat: l.pickupLocation.lat, lon: l.pickupLocation.lon },
      dropoff: { plannedAt: l.dropoffPlannedAt, actualAt: l.dropoffActualAt, locationName: l.dropoffLocation.name, lat: l.dropoffLocation.lat, lon: l.dropoffLocation.lon },
      distanceMiles: l.distanceMiles,
      costUsd: l.costUsd,
      onTimePickup: l.pickupActualAt ? l.pickupActualAt <= l.pickupPlannedAt : false,
      onTimeDropoff: l.dropoffActualAt ? l.dropoffActualAt <= l.dropoffPlannedAt : false
    }))
  });
}
