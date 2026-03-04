"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DashboardFilters } from "@/lib/filters/types";

export function FilterBar({ filters, setFilters, lastUpdated }: { filters: DashboardFilters; setFilters: (f: DashboardFilters) => void; lastUpdated: string }) {
  return <div className="sticky top-14 z-20 mb-4 grid gap-2 rounded-lg border bg-background p-3 md:grid-cols-7">
    <Input aria-label="Search" placeholder="Search reference/customer/location" value={filters.search ?? ""} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
    <Select aria-label="Preset" onChange={(e) => {
      const days = Number(e.target.value);
      if (!days) return;
      setFilters({ ...filters, start: new Date(Date.now()-days*86400000).toISOString(), end: new Date().toISOString()});
    }}><option value="">Date preset</option><option value="1">Today</option><option value="7">Last 7d</option><option value="30">Last 30d</option><option value="90">Last 90d</option></Select>
    <Select aria-label="Status" value={filters.statuses?.[0] ?? ""} onChange={(e) => setFilters({ ...filters, statuses: e.target.value ? [e.target.value] : undefined })}><option value="">All status</option><option>PLANNED</option><option>IN_TRANSIT</option><option>DELIVERED</option><option>DELAYED</option><option>CANCELLED</option></Select>
    <Select aria-label="Mode" value={filters.modes?.[0] ?? ""} onChange={(e) => setFilters({ ...filters, modes: e.target.value ? [e.target.value] : undefined })}><option value="">All mode</option><option>TRUCK</option><option>RAIL</option><option>INTERMODAL</option><option>OCEAN</option><option>AIR</option></Select>
    <label className="flex items-center gap-2 text-xs">Filter to map <Switch checked={!!filters.mapBoundsOnly} onCheckedChange={(v)=>setFilters({...filters,mapBoundsOnly:v})} /></label>
    <Button className="bg-muted text-foreground" onClick={() => setFilters({ start: new Date(Date.now() - 30*86400000).toISOString(), end: new Date().toISOString() })}>Clear filters</Button>
    <div className="text-xs text-muted-foreground">Last updated: {new Date(lastUpdated).toLocaleTimeString()}</div>
  </div>;
}
