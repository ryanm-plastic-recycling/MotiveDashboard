"use client";
import Link from "next/link";
export function LoadDetailDrawer({ open, detail, onClose }: { open: boolean; detail: any; onClose: ()=>void }) {
  if (!open) return null;
  return <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-auto border-l bg-background p-4"><button onClick={onClose} className="mb-4 text-sm">Close</button><h3 className="font-semibold">{detail?.load?.reference}</h3><p className="text-sm">{detail?.load?.carrier?.name}</p><p className="mb-2 text-sm">{detail?.load?.status}</p><div className="space-y-2 text-xs">{detail?.events?.map((e:any)=><div key={e.id} className="rounded border p-2"><strong>{e.eventType}</strong> {new Date(e.eventAt).toLocaleString()}</div>)}</div><Link href={`/loads/${detail?.load?.id}`} className="mt-3 block text-sm text-primary">Open full details</Link></aside>;
}
