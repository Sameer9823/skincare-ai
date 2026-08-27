import type { NextAuthConfig } from "next-auth"

export const authConfig: NextAuthConfig = {
  providers: [], // leave empty here, real providers go in auth.ts
  pages: { signIn: "/login" },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtectedRoute =
        nextUrl.pathname.startsWith("/diagnosis") ||
        nextUrl.pathname.startsWith("/history") ||
        nextUrl.pathname.startsWith("/prescription") ||
        nextUrl.pathname.startsWith("/hospitals")

      if (isProtectedRoute && !isLoggedIn) return false
      return true
    },
  },
}