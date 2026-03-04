"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { TimeSeriesChart } from "@/components/dashboard/TimeSeriesChart";
import { BreakdownCharts } from "@/components/dashboard/BreakdownCharts";
import { LoadsMap } from "@/components/dashboard/LoadsMap";
import { LoadsTable } from "@/components/dashboard/LoadsTable";
import { LoadDetailDrawer } from "@/components/dashboard/LoadDetailDrawer";
import { decodeFiltersFromSearchParams, encodeFiltersToSearchParams } from "@/lib/filters/urlState";
import { DashboardFilters } from "@/lib/filters/types";

const fetchJson = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filters, setFiltersState] = useState<DashboardFilters>(() => decodeFiltersFromSearchParams(new URLSearchParams(sp.toString())));
  const [selected, setSelected] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date().toISOString());

  const setFilters = (f: DashboardFilters) => {
    setFiltersState(f);
    router.replace(`${pathname}?${encodeFiltersToSearchParams(f).toString()}`);
  };

  const q = useMemo(() => encodeFiltersToSearchParams(filters).toString(), [filters]);
  const metrics = useQuery({ queryKey: ["metrics", q], queryFn: () => fetchJson(`/api/metrics?${q}`), refetchInterval: false });
  const loads = useQuery({ queryKey: ["loads", q], queryFn: async () => { const d = await fetchJson(`/api/loads?${q}&page=1&pageSize=200`); setLastUpdated(new Date().toISOString()); return d; } });
  const detail = useQuery({ queryKey: ["load", selected], queryFn: () => fetchJson(`/api/loads/${selected}`), enabled: !!selected });

  return <AppShell>
    <FilterBar filters={filters} setFilters={setFilters} lastUpdated={lastUpdated} />
    <div className="mb-3 flex gap-2"><button className="rounded border px-2 py-1 text-xs" onClick={() => localStorage.setItem("savedView:default", JSON.stringify(filters))}>Save View</button><button className="rounded border px-2 py-1 text-xs" onClick={() => { const v = localStorage.getItem("savedView:default"); if (v) setFilters(JSON.parse(v)); }}>Apply View</button></div>
    <KpiCards data={metrics.data} loading={metrics.isLoading} onDeliveredClick={() => setFilters({ ...filters, statuses: ["DELIVERED"] })} />
    <div className="my-3 grid gap-3 md:grid-cols-2">
      <TimeSeriesChart data={metrics.data?.timeseries ?? []} />
      <LoadsMap rows={loads.data?.rows ?? []} onSelect={setSelected} onBounds={(bbox:string)=>filters.mapBoundsOnly && setFilters({ ...filters, bbox })} />
    </div>
    <BreakdownCharts data={metrics.data?.breakdowns} onStatusClick={(s) => setFilters({ ...filters, statuses: [s] })} onModeClick={(m) => setFilters({ ...filters, modes: [m] })} />
    <div className="mt-3"><LoadsTable rows={loads.data?.rows ?? []} onSelect={setSelected} /></div>
    <LoadDetailDrawer open={!!selected} detail={detail.data} onClose={() => setSelected(null)} />
  </AppShell>;
}
