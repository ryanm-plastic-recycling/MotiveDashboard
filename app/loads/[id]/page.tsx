import { prisma } from "@/lib/db/prisma";
import { AppShell } from "@/components/layout/AppShell";

export default async function LoadDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const load = await prisma.load.findUnique({ where: { id }, include: { carrier: true, customer: true, pickupLocation: true, dropoffLocation: true, events: true } });
  if (!load) return <AppShell><p>Load not found</p></AppShell>;
  return <AppShell><h1 className="mb-2 text-2xl font-semibold">{load.reference}</h1><div className="grid gap-2 md:grid-cols-2"><div className="rounded border p-3"><p>Status: {load.status}</p><p>Mode: {load.mode}</p><p>Carrier: {load.carrier.name}</p><p>Customer: {load.customer.name}</p></div><div className="rounded border p-3"><p>Pickup: {load.pickupLocation.name}</p><p>Dropoff: {load.dropoffLocation.name}</p><p>Cost: ${load.costUsd.toFixed(2)}</p><p>Distance: {load.distanceMiles.toFixed(1)} mi</p></div></div><h2 className="mt-4 font-semibold">Events</h2><ul className="mt-2 space-y-2">{load.events.map(e=><li className="rounded border p-2 text-sm" key={e.id}>{e.eventType} — {new Date(e.eventAt).toLocaleString()}</li>)}</ul></AppShell>;
}
