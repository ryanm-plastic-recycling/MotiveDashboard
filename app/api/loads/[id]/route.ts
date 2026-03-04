import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const load = await prisma.load.findUnique({ where: { id }, include: { carrier: true, customer: true, pickupLocation: true, dropoffLocation: true } });
  if (!load) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const events = await prisma.loadEvent.findMany({ where: { loadId: id }, include: { location: true }, orderBy: { eventAt: "asc" } });
  return NextResponse.json({ load, events });
}
