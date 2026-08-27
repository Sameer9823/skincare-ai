"use client"

import Link from "next/link"
import { FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PrescriptionSection() {
  return (
    <div className="feature-card flex flex-col p-6 h-full">
      <div className="icon-badge icon-badge-violet h-11 w-11 rounded-full mb-4">
        <FileText className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">Prescription &amp; Medical Documents</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
        Upload and manage your prescriptions in one secure place.
      </p>
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-10 w-8 items-center justify-center rounded-md border border-[hsl(var(--brand-violet-soft))] bg-[hsl(var(--brand-violet-soft))]">
          <FileText className="h-4 w-4 text-[hsl(var(--brand-violet))]" />
        </div>
        <div className="flex h-10 w-8 items-center justify-center rounded-md border border-[hsl(var(--brand-violet-soft))] bg-[hsl(var(--brand-violet-soft))]">
          <FileText className="h-4 w-4 text-[hsl(var(--brand-violet))]" />
        </div>
        <span className="text-xs text-muted-foreground">Securely stored &amp; organized</span>
      </div>
      <Link href="/prescription">
        <Button variant="outline" className="w-full rounded-full gap-1.5 justify-center">
          Manage Prescriptions
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  )
}
