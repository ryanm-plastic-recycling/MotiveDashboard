import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({ search: z.string().default("") });

export async function GET(req: NextRequest) {
  const parsed = schema.parse(Object.fromEntries(req.nextUrl.searchParams.entries()));
  const locations = await prisma.location.findMany({ where: { name: { contains: parsed.search, mode: "insensitive" } }, take: 20 });
  return NextResponse.json(locations.map((l) => ({ id: l.id, name: l.name, lat: l.lat, lon: l.lon })));
}
