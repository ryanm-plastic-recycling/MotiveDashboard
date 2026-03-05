"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { clientEnv } from "@/lib/env.client";

const MapInner = dynamic(() => import("./LoadsMapInner"), { ssr: false });

export function LoadsMap(props: any) {
  const hasMapbox = Boolean(clientEnv.NEXT_PUBLIC_MAPBOX_TOKEN);

  return (
    <Card className="h-80 overflow-hidden">
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Load Geography</h3>
          <span className="text-xs text-muted-foreground">Provider: {hasMapbox ? "Mapbox" : "Leaflet/OSM"}</span>
        </div>
        {!hasMapbox && <p className="mb-2 text-xs text-muted-foreground">Mapbox not configured; using Leaflet fallback.</p>}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded border">
          <MapInner {...props} />
        </div>
      </div>
    </Card>
  );
}
