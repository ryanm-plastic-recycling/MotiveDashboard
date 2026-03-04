import Link from "next/link";
export function SideNav() { return <aside className="w-56 border-r p-4"><h2 className="mb-4 font-semibold">Transportation</h2><nav className="space-y-2 text-sm"><Link href="/dashboard" className="block">Dashboard</Link></nav></aside>; }
