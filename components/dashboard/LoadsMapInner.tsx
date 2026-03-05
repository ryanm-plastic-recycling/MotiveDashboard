"use client";

import L from "leaflet";
import { Fragment, useMemo } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from "react-leaflet";

const marker = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [20, 32]
});

function BoundsWatcher({ onBounds }: { onBounds: (bbox: string) => void }) {
  useMapEvents({
    moveend: (e) => {
      const b = e.target.getBounds();
      onBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].join(","));
    }
  });

  return null;
}

export default function LoadsMapInner({ rows = [], onSelect, onBounds }: any) {
  const validRows = useMemo(
    () => rows.filter((r: any) => r.pickup?.lat && r.pickup?.lon && r.dropoff?.lat && r.dropoff?.lon).slice(0, 400),
    [rows]
  );

  return (
    <MapContainer className="h-full w-full" center={[39, -96]} zoom={4} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <BoundsWatcher onBounds={onBounds} />
      {validRows.map((r: any) => (
        <Fragment key={r.id}>
          <Marker position={[r.pickup.lat, r.pickup.lon]} icon={marker} eventHandlers={{ click: () => onSelect(r.id) }}>
            <Popup>{r.reference} pickup</Popup>
          </Marker>
          <Marker position={[r.dropoff.lat, r.dropoff.lon]} icon={marker} eventHandlers={{ click: () => onSelect(r.id) }}>
            <Popup>{r.reference} dropoff</Popup>
          </Marker>
          <Polyline positions={[[r.pickup.lat, r.pickup.lon], [r.dropoff.lat, r.dropoff.lon]]} />
        </Fragment>
      ))}
    </MapContainer>
  );
}
