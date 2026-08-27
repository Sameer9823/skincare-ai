import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/diagnosis/:path*", "/history/:path*", "/prescription/:path*", "/hospitals/:path*"],
}