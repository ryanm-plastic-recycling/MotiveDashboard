"use client";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
const MapInner = dynamic(() => import("./LoadsMapInner"), { ssr: false });
export function LoadsMap(props: any) { return <Card className="h-80"><h3 className="mb-2 text-sm font-semibold">Load Geography</h3><MapInner {...props} /></Card>; }
