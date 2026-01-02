import { type NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  
  const path = req.nextUrl.pathname;

  const isPublicPath =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/hackathons") && !path.startsWith("/hackathons-info");

  if (isPublicPath) {
    return NextResponse.next();
  }

  const token = req.cookies.get("Token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};