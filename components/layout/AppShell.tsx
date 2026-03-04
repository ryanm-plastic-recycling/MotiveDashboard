import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";
export function AppShell({ children }: { children: React.ReactNode }) { return <div className="flex min-h-screen"><SideNav /><div className="flex-1"><TopNav /><main className="p-4">{children}</main></div></div>; }
