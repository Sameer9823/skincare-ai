"use client"

import { Brain, UserCheck, Clock, Stethoscope } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const benefits = [
  {
    icon: Brain,
    title: "AI-Assisted Analysis",
    description: "Understand visible skin characteristics using advanced AI trained on dermatological patterns.",
    color: "icon-badge-teal",
  },
  {
    icon: UserCheck,
    title: "Personalized Insights",
    description: "Receive structured information based on your unique analysis with actionable guidance.",
    color: "icon-badge-blue",
  },
  {
    icon: Clock,
    title: "Progress Tracking",
    description: "Compare previous analysis results over time to monitor changes in your skin health.",
    color: "icon-badge-violet",
  },
  {
    icon: Stethoscope,
    title: "Healthcare Guidance",
    description: "Know when professional medical advice may be appropriate with clear referral indicators.",
    color: "icon-badge-coral",
  },
]

export function Benefits() {
  return (
    <section id="benefits" className="py-14 md:py-16 bg-background">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">
            Why Choose SkinCare AI
          </p>
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
            Smarter Insights for Healthier Skin
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="feature-card group overflow-hidden"
            >
              <CardContent className="p-5 space-y-3">
                <div className={`icon-badge ${benefit.color} h-11 w-11 rounded-full`}>
                  <benefit.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}