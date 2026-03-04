"use client";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
export function TopNav() {
  const [dark, setDark] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("theme") === "dark"; setDark(saved); document.documentElement.classList.toggle("dark", saved); }, []);
  const toggle = (v: boolean) => { setDark(v); localStorage.setItem("theme", v ? "dark" : "light"); document.documentElement.classList.toggle("dark", v); };
  return <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4"><span className="font-semibold">Transportation Dashboard</span><div className="flex items-center gap-2 text-sm">Dark mode <Switch checked={dark} onCheckedChange={toggle} /></div></header>;
}
