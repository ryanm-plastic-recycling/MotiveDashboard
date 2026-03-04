"use client";
import { useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const c = createColumnHelper<any>();
export function LoadsTable({ rows, onSelect }: { rows: any[]; onSelect: (id: string) => void }) {
  const columns = useMemo(() => [c.accessor("reference", { header: "Reference" }), c.accessor("status", { header: "Status" }), c.accessor("mode", { header: "Mode" }), c.accessor("carrierName", { header: "Carrier" }), c.accessor("customerName", { header: "Customer" }), c.accessor("costUsd", { header: "Cost", cell: (v) => `$${v.getValue().toFixed(2)}` })], []);
  const table = useReactTable({ data: rows, columns, getCoreRowModel: getCoreRowModel() });
  const exportCsv = () => { const head = ["reference,status,mode,carrier,customer,cost"]; const body = rows.map((r) => [r.reference, r.status, r.mode, r.carrierName, r.customerName, r.costUsd].join(",")); const blob = new Blob([[...head, ...body].join("\n")], { type: "text/csv" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "loads.csv"; a.click(); toast.success("Exported CSV"); };
  return <Card><div className="mb-2 flex justify-end"><Button onClick={exportCsv}>Export CSV</Button></div><div className="max-h-[420px] overflow-auto"><table className="w-full text-sm"><thead className="sticky top-0 bg-background">{table.getHeaderGroups().map((hg)=><tr key={hg.id}>{hg.headers.map((h)=><th className="border-b p-2 text-left" key={h.id}>{flexRender(h.column.columnDef.header,h.getContext())}</th>)}</tr>)}</thead><tbody>{table.getRowModel().rows.map((r)=><tr key={r.id} onClick={()=>onSelect(r.original.id)} className="cursor-pointer hover:bg-muted">{r.getVisibleCells().map((cell)=><td key={cell.id} className="border-b p-2">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table></div></Card>;
}
