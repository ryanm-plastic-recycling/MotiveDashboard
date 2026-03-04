import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50", className)} {...props} />;
}
