import { PrismaClient, LoadStatus, TransportMode } from "@prisma/client";

const prisma = new PrismaClient();
const rand = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const states = [[34.0522,-118.2437,"CA"],[41.8781,-87.6298,"IL"],[29.7604,-95.3698,"TX"],[33.4484,-112.074,"AZ"],[40.7128,-74.006,"NY"],[39.7392,-104.9903,"CO"],[47.6062,-122.3321,"WA"],[25.7617,-80.1918,"FL"]];

async function main() {
  await prisma.loadEvent.deleteMany(); await prisma.load.deleteMany(); await prisma.location.deleteMany(); await prisma.carrier.deleteMany(); await prisma.customer.deleteMany();
  const carriers = await prisma.$transaction(Array.from({ length: 50 }).map((_, i) => prisma.carrier.create({ data: { name: `Carrier ${i+1}` } })));
  const customers = await prisma.$transaction(Array.from({ length: 100 }).map((_, i) => prisma.customer.create({ data: { name: `Customer ${i+1}` } })));
  const locations = await prisma.$transaction(Array.from({ length: 300 }).map((_, i) => { const [lat,lon,s] = rand(states); return prisma.location.create({ data: { name: `Location ${i+1}`, address: `${100+i} Main St`, city: "City", state: s as string, zip: `9${(1000+i)%8999}`, lat: lat + (Math.random()-0.5)*3, lon: lon + (Math.random()-0.5)*3 } }); }));
  for (let i=0;i<2000;i++) {
    const pickup = rand(locations); let dropoff = rand(locations); if (dropoff.id===pickup.id) dropoff = rand(locations);
    const pickupPlannedAt = new Date(Date.now() - Math.random()*90*86400000);
    const pickupActualAt = new Date(pickupPlannedAt.getTime() + (Math.random()-0.3)*6*3600000);
    const dropoffPlannedAt = new Date(pickupPlannedAt.getTime() + (24 + Math.random()*72)*3600000);
    const dropoffActualAt = new Date(dropoffPlannedAt.getTime() + (Math.random()-0.35)*8*3600000);
    const distanceMiles = Math.max(50, Math.random()*2000);
    const load = await prisma.load.create({ data: {
      reference: `LD-${String(i+1).padStart(6,"0")}`,
      status: rand(Object.values(LoadStatus)),
      mode: rand(Object.values(TransportMode)),
      carrierId: rand(carriers).id,
      customerId: rand(customers).id,
      pickupLocationId: pickup.id,
      dropoffLocationId: dropoff.id,
      pickupPlannedAt, pickupActualAt,
      dropoffPlannedAt, dropoffActualAt,
      distanceMiles,
      costUsd: distanceMiles * (1.8 + Math.random()*1.9)
    }});
    await prisma.loadEvent.createMany({ data: [
      { loadId: load.id, eventType: "ARRIVED", eventAt: pickupActualAt, locationId: pickup.id },
      { loadId: load.id, eventType: "DEPARTED", eventAt: new Date(pickupActualAt.getTime()+3600000), locationId: pickup.id },
      { loadId: load.id, eventType: "DELIVERED", eventAt: dropoffActualAt, locationId: dropoff.id }
    ]});
  }
}

main().finally(() => prisma.$disconnect());
