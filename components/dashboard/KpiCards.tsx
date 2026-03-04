"use client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export function KpiCards({ data, loading, onDeliveredClick }: { data: any; loading: boolean; onDeliveredClick: () => void }) {
  if (loading) return <div className="grid gap-3 md:grid-cols-4">{Array.from({ length: 4 }).map((_,i)=><Skeleton key={i} className="h-24" />)}</div>;
  const k = data?.kpis;
  const cards = [
    ["Total Loads", k?.totalLoads?.toLocaleString()],
    ["Delivered", k?.deliveredLoads?.toLocaleString(), onDeliveredClick],
    ["On-time Dropoff", `${(k?.onTimeDropoffPct ?? 0).toFixed(1)}%`],
    ["Avg Cost / Mile", `$${(k?.avgCostPerMile ?? 0).toFixed(2)}`]
  ];
  return <div className="grid gap-3 md:grid-cols-4">{cards.map(([label,val,action]: any)=><Card key={label}><button onClick={action} className="w-full text-left"><p className="text-xs text-muted-foreground">{label}</p><p className="text-2xl font-bold">{val}</p></button></Card>)}</div>;
}
