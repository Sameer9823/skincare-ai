import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  const isProtectedRoute =
    pathname.startsWith("/diagnosis") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/prescription") ||
    pathname.startsWith("/hospitals")

  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }
})

export const config = {
  matcher: ["/diagnosis/:path*", "/history/:path*", "/prescription/:path*", "/hospitals/:path*"],
}
