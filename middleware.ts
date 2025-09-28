import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Pages that require the user to be **not logged in**
const publicOnlyPaths = ["/auth/login", "/auth/register"];

// Pages that require the user to be **logged in**
const protectedPaths = ["/cart", "/my-orders"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get session token (adjust depending on your auth setup)
  const token = req.cookies.get("next-auth.session-token")?.value;

  // Redirect logged-in users away from public-only pages
  if (publicOnlyPaths.some((path) => pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users away from protected pages
  if (protectedPaths.some((path) => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Otherwise, allow access
  return NextResponse.next();
};

// Apply middleware only to these routes
export const config = {
  matcher: ["/auth/login", "/auth/register", "/cart", "/my-orders"],
};
