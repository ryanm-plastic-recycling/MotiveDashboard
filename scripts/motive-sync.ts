import { LoadStatus, Prisma, TransportMode } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { fetchDispatchLocations, fetchDispatches, fetchVehicles } from "@/lib/motive/client";

const parseDate = (value: unknown) => {
  if (!value || typeof value !== "string") return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const mapStatus = (value: unknown): { status: LoadStatus; rawStatus?: string } => {
  const raw = String(value ?? "").toUpperCase();
  if (!raw) return { status: LoadStatus.OTHER };
  if (raw.includes("PLAN")) return { status: LoadStatus.PLANNED, rawStatus: raw };
  if (raw.includes("TRANSIT") || raw.includes("EN_ROUTE")) return { status: LoadStatus.IN_TRANSIT, rawStatus: raw };
  if (raw.includes("DELIVER")) return { status: LoadStatus.DELIVERED, rawStatus: raw };
  if (raw.includes("DELAY")) return { status: LoadStatus.DELAYED, rawStatus: raw };
  if (raw.includes("CANCEL")) return { status: LoadStatus.CANCELLED, rawStatus: raw };
  return { status: LoadStatus.OTHER, rawStatus: raw };
};

const toNumber = (value: unknown) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

async function ensureDemoRefs() {
  const [carrier, customer] = await Promise.all([
    prisma.carrier.upsert({ where: { id: "motive-carrier" }, update: { name: "Motive Carrier" }, create: { id: "motive-carrier", name: "Motive Carrier" } }),
    prisma.customer.upsert({ where: { id: "motive-customer" }, update: { name: "Motive Customer" }, create: { id: "motive-customer", name: "Motive Customer" } })
  ]);

  return { carrier, customer };
}


async function ensureUnknownLocation(kind: "pickup" | "dropoff") {
  return prisma.location.upsert({
    where: { motiveDispatchLocationId: `unknown-${kind}` },
    update: { name: `Unknown ${kind} location` },
    create: {
      motiveDispatchLocationId: `unknown-${kind}`,
      name: `Unknown ${kind} location`,
      address: "",
      city: "",
      state: "",
      zip: "",
      lat: 0,
      lon: 0
    }
  });
}

async function main() {
  if (!env.MOTIVE_ENABLED) {
    console.error("MOTIVE_ENABLED=false. Enable Motive sync in .env before running this command.");
    process.exit(1);
  }

  if (!env.MOTIVE_API_KEY) {
    console.error("MOTIVE_API_KEY is missing. Set it in .env before running this command.");
    process.exit(1);
  }

  const startDate = new Date(Date.now() - env.MOTIVE_SYNC_LOOKBACK_DAYS * 86400000);

  const [dispatchLocations, vehicles, dispatches, refs, unknownPickup, unknownDropoff] = await Promise.all([
    fetchDispatchLocations(),
    fetchVehicles({ updatedAfter: startDate.toISOString() }),
    fetchDispatches({ start: startDate.toISOString(), end: new Date().toISOString() }),
    ensureDemoRefs(),
    ensureUnknownLocation("pickup"),
    ensureUnknownLocation("dropoff")
  ]);

  const locationsByMotiveId = new Map<string, string>();

  let locationsUpserted = 0;
  for (const location of dispatchLocations) {
    const motiveId = String(location.id ?? "");
    if (!motiveId) continue;
    const lat = toNumber(location.latitude ?? location.lat);
    const lon = toNumber(location.longitude ?? location.lon);
    if (lat === undefined || lon === undefined) continue;

    const saved = await prisma.location.upsert({
      where: { motiveDispatchLocationId: motiveId },
      update: {
        name: location.name ?? `Location ${motiveId}`,
        address: location.address ?? "",
        city: location.city ?? "",
        state: location.state ?? "",
        zip: location.zip ?? "",
        lat,
        lon
      },
      create: {
        motiveDispatchLocationId: motiveId,
        name: location.name ?? `Location ${motiveId}`,
        address: location.address ?? "",
        city: location.city ?? "",
        state: location.state ?? "",
        zip: location.zip ?? "",
        lat,
        lon
      }
    });

    locationsByMotiveId.set(motiveId, saved.id);
    locationsUpserted += 1;
  }

  const vehiclesByMotiveId = new Map<string, string>();
  let vehiclesUpserted = 0;

  for (const vehicle of vehicles) {
    const motiveId = String(vehicle.id ?? "");
    if (!motiveId) continue;

    const saved = await prisma.vehicle.upsert({
      where: { motiveVehicleId: motiveId },
      update: {
        number: String(vehicle.number ?? vehicle.vehicle_number ?? motiveId),
        name: vehicle.name ?? vehicle.vehicle_name ?? null
      },
      create: {
        motiveVehicleId: motiveId,
        number: String(vehicle.number ?? vehicle.vehicle_number ?? motiveId),
        name: vehicle.name ?? vehicle.vehicle_name ?? null
      }
    });

    vehiclesByMotiveId.set(motiveId, saved.id);
    vehiclesUpserted += 1;
  }

  let loadsUpserted = 0;
  for (const dispatch of dispatches) {
    const motiveDispatchId = String(dispatch.id ?? "");
    if (!motiveDispatchId) continue;

    const pickupLocationId = dispatch.shipper_dispatch_location_id ? locationsByMotiveId.get(String(dispatch.shipper_dispatch_location_id)) ?? unknownPickup.id : unknownPickup.id;
    const dropoffLocationId = dispatch.consignee_dispatch_location_id ? locationsByMotiveId.get(String(dispatch.consignee_dispatch_location_id)) ?? unknownDropoff.id : unknownDropoff.id;

    const pickupLate = parseDate(dispatch.pickup_late_date) ?? parseDate(dispatch.pickup_early_date) ?? new Date();
    const dropoffLate = parseDate(dispatch.delivery_late_date) ?? parseDate(dispatch.delivery_early_date) ?? pickupLate;

    const reference = String(dispatch.vendor_id ?? dispatch.pickup_number ?? dispatch.reference ?? dispatch.id);
    const motiveVehicleId = dispatch.vehicle_id ? String(dispatch.vehicle_id) : undefined;
    const vehicleId = motiveVehicleId ? vehiclesByMotiveId.get(motiveVehicleId) : undefined;
    const distanceMiles = toNumber(dispatch.loaded_miles) ?? 0;
    const status = mapStatus(dispatch.status);

    const payload: Prisma.LoadUncheckedCreateInput = {
      reference: `${reference}-${motiveDispatchId}`,
      motiveDispatchId,
      motiveVehicleId,
      motiveDriverId: dispatch.driver_id ? String(dispatch.driver_id) : undefined,
      rawStatus: status.rawStatus,
      status: status.status,
      mode: TransportMode.TRUCK,
      carrierId: refs.carrier.id,
      customerId: refs.customer.id,
      vehicleId,
      pickupLocationId,
      dropoffLocationId,
      pickupPlannedAt: pickupLate,
      dropoffPlannedAt: dropoffLate,
      distanceMiles,
      costUsd: toNumber(dispatch.cost_usd) ?? 0
    };

    await prisma.load.upsert({
      where: { motiveDispatchId },
      update: payload,
      create: payload
    });

    loadsUpserted += 1;
  }

  console.info(`Motive sync summary: dispatch_locations fetched=${dispatchLocations.length}, upserted=${locationsUpserted}`);
  console.info(`Motive sync summary: vehicles fetched=${vehicles.length}, upserted=${vehiclesUpserted}`);
  console.info(`Motive sync summary: dispatches fetched=${dispatches.length}, upserted=${loadsUpserted}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
