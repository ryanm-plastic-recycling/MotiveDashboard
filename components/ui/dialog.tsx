import * as React from "react";
export function Dialog({ open, children }: { open: boolean; children: React.ReactNode }) { if (!open) return null; return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">{children}</div>; }
export const DialogContent = ({ children }: { children: React.ReactNode }) => <div className="w-full max-w-lg rounded-lg border bg-background p-4">{children}</div>;
