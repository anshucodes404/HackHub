import { NextRequest, NextResponse } from "next/server";


export function middleware(req: NextRequest) {
  const token = req.cookies.get("Token")?.value || req.headers.get("Authorization")?.split(" ")[1]
  console.log(token)
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: ['/hackathons-info/:path*', '/participated-hackathons/:path*', '/profile/:path*', '/dashboard/:path*'],
};