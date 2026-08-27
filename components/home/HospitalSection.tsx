"use client"

import Link from "next/link"
import { MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HospitalSection() {
  return (
    <div className="feature-card flex flex-col p-6 h-full">
      <div className="icon-badge icon-badge-blue h-11 w-11 rounded-full mb-4">
        <MapPin className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">Find Nearby Hospitals</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
        Locate hospitals and clinics near you on an interactive map.
      </p>
      <div className="mb-5 flex items-center gap-2 rounded-lg border border-[hsl(var(--brand-blue-soft))] bg-[hsl(var(--brand-blue-soft))] p-2">
        <div className="relative h-8 w-8 shrink-0 rounded-full bg-white flex items-center justify-center shadow-sm">
          <MapPin className="h-4 w-4 text-[hsl(var(--brand-blue))]" />
        </div>
        <span className="text-xs text-[hsl(var(--brand-blue))] font-medium">3 clinics within 2 km</span>
      </div>
      <Link href="/hospitals">
        <Button variant="outline" className="w-full rounded-full gap-1.5 justify-center">
          Find Hospitals
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  )
}
