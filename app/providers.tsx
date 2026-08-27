"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
import type { Session } from "next-auth"

// SkinCare AI ships a single, polished light theme — there is no dark mode
// toggle, so we no longer wrap the app in next-themes' ThemeProvider.
export function Providers({
  children,
  session,
}: {
  children: ReactNode
  session?: Session | null
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
