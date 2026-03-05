import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const motiveLoadCount = await prisma.load.count({ where: { motiveDispatchId: { not: null } } });
  return NextResponse.json({ source: motiveLoadCount > 0 ? "Motive" : "Demo Data" });
}
