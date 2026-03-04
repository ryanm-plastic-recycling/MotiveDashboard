import { Prisma, LoadStatus, TransportMode } from "@prisma/client";
import { prisma } from "./prisma";

export type LoadFilters = {
  start: Date;
  end: Date;
  search?: string;
  carrierId?: string;
  customerId?: string;
  status?: LoadStatus;
  mode?: TransportMode;
};

export function buildWhere(f: LoadFilters): Prisma.LoadWhereInput {
  return {
    dropoffPlannedAt: { gte: f.start, lte: f.end },
    ...(f.search
      ? {
          OR: [
            { reference: { contains: f.search, mode: "insensitive" } },
            { customer: { name: { contains: f.search, mode: "insensitive" } } },
            { pickupLocation: { name: { contains: f.search, mode: "insensitive" } } },
            { dropoffLocation: { name: { contains: f.search, mode: "insensitive" } } }
          ]
        }
      : {}),
    ...(f.carrierId ? { carrierId: f.carrierId } : {}),
    ...(f.customerId ? { customerId: f.customerId } : {}),
    ...(f.status ? { status: f.status } : {}),
    ...(f.mode ? { mode: f.mode } : {})
  };
}

export async function getLoads(where: Prisma.LoadWhereInput, page: number, pageSize: number, orderBy: Prisma.LoadOrderByWithRelationInput) {
  const [total, loads] = await Promise.all([
    prisma.load.count({ where }),
    prisma.load.findMany({
      where,
      include: { carrier: true, customer: true, pickupLocation: true, dropoffLocation: true },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
  ]);
  return { total, loads };
}
