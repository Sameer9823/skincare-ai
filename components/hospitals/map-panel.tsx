"use client"

import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import type { MapHospital } from "@/components/hospitals/google-map"

const GoogleHospitalMap = dynamic(
  () => import("@/components/hospitals/google-map").then((m) => m.GoogleHospitalMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted/40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    ),
  }
)

interface MapPanelProps {
  center: { lat: number; lng: number }
  hospitals: MapHospital[]
  className?: string
}

export function MapPanel({ center, hospitals, className }: MapPanelProps) {
  return <GoogleHospitalMap center={center} hospitals={hospitals} className={className} />
}