import type React from "react"
import type { Metadata } from "next"
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { Providers } from "@/app/providers"
import { auth } from "@/lib/auth"
import { Toaster } from "@/components/ui/toaster"

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
})

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "SkinCare AI",
  description: "AI-powered precision in skin condition screening",
  generator: "v0.dev",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <Providers session={session}>
          <Navigation />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
