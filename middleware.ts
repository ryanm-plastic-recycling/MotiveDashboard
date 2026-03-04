import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (process.env.AUTH_ENABLED !== "true") return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/api/auth")) return NextResponse.next();
  const hasSession = !!req.cookies.get("next-auth.session-token")?.value;
  if (!hasSession) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/loads/:path*"] };
