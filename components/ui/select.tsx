import * as React from "react";
export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) { return <select className="h-9 rounded-md border bg-background px-2 text-sm" {...props}>{children}</select>; }
