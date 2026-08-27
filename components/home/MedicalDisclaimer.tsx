"use client"

import { AlertTriangle } from "lucide-react"

export function MedicalDisclaimer() {
  return (
    <section id="disclaimer" className="py-6 bg-background">
      <div className="container">
        <div className="flex items-start gap-4 rounded-2xl bg-[hsl(var(--disclaimer-bg))] border border-[hsl(24_80%_88%)] px-5 py-4 sm:px-6 sm:py-5">
          <AlertTriangle className="h-5 w-5 text-[hsl(var(--disclaimer-foreground))] mt-0.5 shrink-0" />
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <h3 className="text-sm font-semibold text-[hsl(var(--disclaimer-foreground))] shrink-0">Medical Disclaimer</h3>
            <p className="text-sm text-[#8a4231] leading-relaxed">
              This platform provides AI-assisted information based on uploaded images and should not replace
              professional medical diagnosis, treatment, or advice. If you have a persistent, worsening, or
              concerning skin condition, consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
