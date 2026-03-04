"use client";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
export function BreakdownCharts({ data, onStatusClick, onModeClick }: { data: any; onStatusClick: (s: string)=>void; onModeClick: (m: string)=>void }) {
  return <div className="grid gap-3 md:grid-cols-3">
    <Card className="h-64"><h4 className="text-sm font-semibold">By Carrier</h4><ResponsiveContainer width="100%" height="90%"><BarChart data={data?.byCarrier ?? []}><XAxis dataKey="carrierName" hide /><YAxis /><Tooltip /><Bar dataKey="totalLoads" fill="#6366f1" /></BarChart></ResponsiveContainer></Card>
    <Card className="h-64"><h4 className="text-sm font-semibold">By Status</h4><ResponsiveContainer width="100%" height="90%"><BarChart data={data?.byStatus ?? []} onClick={(x:any)=>x?.activePayload?.[0]?.payload?.status && onStatusClick(x.activePayload[0].payload.status)}><XAxis dataKey="status" /><YAxis /><Tooltip /><Bar dataKey="totalLoads" fill="#0ea5e9" /></BarChart></ResponsiveContainer></Card>
    <Card className="h-64"><h4 className="text-sm font-semibold">By Mode</h4><ResponsiveContainer width="100%" height="90%"><BarChart data={data?.byMode ?? []} onClick={(x:any)=>x?.activePayload?.[0]?.payload?.mode && onModeClick(x.activePayload[0].payload.mode)}><XAxis dataKey="mode" /><YAxis /><Tooltip /><Bar dataKey="totalLoads" fill="#f59e0b" /></BarChart></ResponsiveContainer></Card>
  </div>;
}
