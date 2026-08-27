"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const checklist = [
  "Clear explanation of visible skin concerns",
  "Possible causes and contributing factors",
  "Practical care tips and recommendations",
  "Guidance on when to see a doctor",
  "Save and track your progress over time",
]

export function AnalysisPreview() {
  return (
    <section id="analysis-preview" className="py-16 md:py-20 surface-violet">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - result card */}
          <div className="rounded-3xl bg-background border border-border/60 shadow-lg p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="relative w-full sm:w-40 h-48 sm:h-auto shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src="/images/ana.png"
                  alt="Uploaded face for AI skin analysis"
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">AI Analysis Result</p>
                  <span className="rounded-full bg-amber-100 text-amber-800 text-[11px] font-medium px-2.5 py-1">
                    Moderate Confidence
                  </span>
                </div>
                <h3 className="text-2xl font-display font-semibold text-foreground">Acne</h3>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-foreground">78%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: "78%" }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Severity</span>
                  <span className="rounded-full bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1">
                    Moderate
                  </span>
                </div>

                <Link href="/diagnosis">
                  <Button className="w-full rounded-full btn-gradient gap-2">
                    View Full Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right - explanation */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">
                Real Insights. Real Progress.
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
                Detailed Results You Can Understand
              </h2>
            </div>

            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
