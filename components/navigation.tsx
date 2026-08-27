"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { Menu, X, LogOut, History as HistoryIcon, FileText, Leaf, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const routes = [
  { href: "/", label: "Home" },
  { href: "/diagnosis", label: "Skin Analysis" },
  { href: "/prescription", label: "Prescription" },
  { href: "/hospitals", label: "Find Hospital" },
  { href: "/history", label: "History" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? session?.user?.email?.[0]?.toUpperCase()

  const handleNavClick = (scrollTo?: string) => {
    if (scrollTo && pathname === "/") {
      const element = document.getElementById(scrollTo)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setIsOpen(false)
        return true
      }
    }
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background">
      <div className="container flex h-[76px] items-center justify-between">
        {/* Logo / wordmark */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="icon-badge icon-badge-teal h-9 w-9 shrink-0 rounded-full">
            <Leaf className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-foreground">
              SkinCare <span className="text-primary">AI</span>
            </span>
            <span className="hidden sm:block text-[9px] font-semibold tracking-[0.16em] text-muted-foreground">
              HEALTHIER SKIN. BRIGHTER YOU.
            </span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-6">
          {routes.map((route) => {
            const base = route.href.split("#")[0]
            const isActive = route.href === "/" ? pathname === "/" : base !== "/" && pathname.startsWith(base)
            return (
              <Link
                key={route.label}
                href={route.href}
                onClick={(e) => {
                  if (route.scrollTo && handleNavClick(route.scrollTo)) {
                    e.preventDefault()
                  }
                }}
                className={`relative pb-1 text-[13px] font-medium tracking-wide transition-colors hover:text-foreground ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {route.label}
                {isActive && (
                  <span className="absolute left-0 right-0 -bottom-[2px] h-[2px] rounded-full bg-gradient-to-r from-[hsl(var(--brand-teal))] to-[hsl(var(--brand-blue))]" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {status === "authenticated" ? (
            <>
              <Link href="/diagnosis" className="hidden md:block">
                <Button className="btn-gradient rounded-full gap-1.5 h-10 px-5">
                  Start Analysis
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={session.user?.image ?? undefined} alt={session.user?.name ?? "Account"} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {initials ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="font-normal">
                    <p className="text-sm font-medium leading-none">{session.user?.name ?? "Your account"}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">{session.user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/diagnosis" className="cursor-pointer flex items-center gap-2">
                      <Leaf className="h-4 w-4" />
                      Skin Analysis
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/history" className="cursor-pointer flex items-center gap-2">
                      <HistoryIcon className="h-4 w-4" />
                      Analysis History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/prescription" className="cursor-pointer flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Prescriptions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })} className="cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : status === "loading" ? (
            <div className="h-10 w-32 rounded-full bg-muted animate-pulse" />
          ) : (
            <>
              <Link href="/login" className="hidden md:block">
                <Button variant="ghost" className="text-[13px]">
                  Sign in
                </Button>
              </Link>
              <Link href="/diagnosis" className="hidden md:block">
                <Button className="btn-gradient rounded-full gap-1.5 h-10 px-5">
                  Start Analysis
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </>
          )}

          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background py-4">
          <div className="container space-y-1">
            {routes.map((route) => (
              <Link
                key={route.label}
                href={route.href}
                onClick={(e) => {
                  if (route.scrollTo && handleNavClick(route.scrollTo)) {
                    e.preventDefault()
                  } else {
                    setIsOpen(false)
                  }
                }}
                className={`block py-2 text-base font-medium transition-colors hover:text-foreground ${
                  pathname === route.href ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {route.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {status === "authenticated" ? (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false)
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  Sign out
                </Button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/diagnosis" onClick={() => setIsOpen(false)}>
                    <Button className="w-full btn-gradient">
                      Start Analysis
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
