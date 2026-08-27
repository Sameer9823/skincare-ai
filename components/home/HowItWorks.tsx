"use client"

import { Camera, Cog, FileText, TrendingUp, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: Camera,
    title: "Capture",
    description: "Upload or capture a clear skin image.",
    color: "icon-badge-teal",
  },
  {
    number: "02",
    icon: Cog,
    title: "Analyze",
    description: "The AI evaluates visible skin characteristics.",
    color: "icon-badge-blue",
  },
  {
    number: "03",
    icon: FileText,
    title: "Understand",
    description: "Review the AI-assisted results and insights.",
    color: "icon-badge-violet",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Track",
    description: "Save results and monitor changes over time.",
    color: "icon-badge-coral",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-14 md:py-16 bg-[hsl(var(--pale-green))]">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">
            Simple. Fast. Effective.
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-col items-center text-center px-4">
              <div className="relative mb-4">
                <div className={`icon-badge ${step.color} h-14 w-14 rounded-full`}>
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </div>
              </div>
              <span className="text-sm font-display font-semibold text-primary mb-1">{step.number}</span>
              <h3 className="text-base font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[180px]">{step.description}</p>

              {index < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-6 -right-3 h-5 w-5 text-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
