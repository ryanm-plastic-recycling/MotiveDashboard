import * as React from "react";
export function Switch({ checked, onCheckedChange, ...props }: { checked: boolean; onCheckedChange: (v: boolean) => void } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>,"onChange">) {
  return <button aria-pressed={checked} onClick={() => onCheckedChange(!checked)} className={`h-6 w-11 rounded-full ${checked ? "bg-primary" : "bg-muted"}`} {...props}><span className={`block h-5 w-5 rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-0"}`} /></button>;
}
