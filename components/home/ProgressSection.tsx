"use client"

import Link from "next/link"
import { TrendingUp, ArrowRight, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProgressSection() {
  return (
    <div className="feature-card flex flex-col p-6 h-full">
      <div className="icon-badge icon-badge-teal h-11 w-11 rounded-full mb-4">
        <TrendingUp className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">Your Analysis History</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
        Track your skin journey and see your progress over time.
      </p>
      <div className="mb-5 flex items-end gap-1.5 h-10">
        {[40, 65, 50, 80, 60, 92].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-[hsl(var(--brand-teal))] to-[hsl(var(--brand-blue))]"
            style={{ height: `${h}%` }}
          />
        ))}
        <LineChart className="h-4 w-4 text-primary ml-1 shrink-0" />
      </div>
      <Link href="/history">
        <Button variant="outline" className="w-full rounded-full gap-1.5 justify-center">
          View History
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  )
}
