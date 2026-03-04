"use client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
export function TimeSeriesChart({ data }: { data: any[] }) { return <Card className="h-80"><h3 className="mb-2 text-sm font-semibold">Load & On-time Trends</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={data}><XAxis dataKey="date" /><YAxis yAxisId="a" /><YAxis yAxisId="b" orientation="right" /><Tooltip /><Line yAxisId="a" type="monotone" dataKey="totalLoads" stroke="#3b82f6" /><Line yAxisId="b" type="monotone" dataKey="onTimeDropoffPct" stroke="#22c55e" /></LineChart></ResponsiveContainer></Card>; }
