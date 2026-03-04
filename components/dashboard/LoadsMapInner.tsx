"use client";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";

const marker = new L.Icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", iconSize: [20, 32] });
function BoundsWatcher({ onBounds }: { onBounds: (bbox: string)=>void }) { useMapEvents({ moveend: (e) => { const b = e.target.getBounds(); onBounds([b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].join(",")); } }); return null; }
export default function LoadsMapInner({ rows = [], onSelect, onBounds }: any) {
  return <MapContainer style={{ height: "90%" }} center={[39, -96]} zoom={4}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><BoundsWatcher onBounds={onBounds} />
    {rows.slice(0, 400).map((r:any)=><><Marker key={`${r.id}-p`} position={[r.pickup.lat, r.pickup.lon]} icon={marker} eventHandlers={{ click:()=>onSelect(r.id) }}><Popup>{r.reference} pickup</Popup></Marker><Marker key={`${r.id}-d`} position={[r.dropoff.lat, r.dropoff.lon]} icon={marker} eventHandlers={{ click:()=>onSelect(r.id) }}><Popup>{r.reference} dropoff</Popup></Marker><Polyline key={`${r.id}-l`} positions={[[r.pickup.lat,r.pickup.lon],[r.dropoff.lat,r.dropoff.lon]]} /></>)}
  </MapContainer>;
}
