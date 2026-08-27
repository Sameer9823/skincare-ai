"use client"

import Link from "next/link"
import { ArrowRight, MapPin, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-14 md:py-16" style={{ background: "linear-gradient(120deg, hsl(168 55% 93%) 0%, hsl(214 70% 94%) 55%, hsl(258 65% 95%) 100%)" }}>
      <Leaf className="absolute -top-4 left-[4%] h-28 w-28 text-primary/10 -rotate-12 pointer-events-none" strokeWidth={0.75} />
      <Leaf className="absolute -bottom-8 right-[3%] h-32 w-32 text-primary/10 rotate-[20deg] pointer-events-none" strokeWidth={0.75} />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-5xl mx-auto text-center lg:text-left">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">
              Your Skin Journey Starts Here
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-semibold leading-[1.1] tracking-tight text-foreground mb-4">
              Start Understanding Your Skin Today
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Get AI-assisted insights, track your progress, and know when professional care may be appropriate.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mt-6">
              <Link href="/diagnosis">
                <Button size="lg" className="w-full sm:w-auto rounded-full px-7 btn-gradient gap-2">
                  Start Skin Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/hospitals">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-7 gap-2 bg-background/80 backdrop-blur border-border">
                  Find a Hospital
                  <MapPin className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <p className="hidden lg:block font-display italic text-2xl text-primary rotate-3 shrink-0">
            Better Skin,
            <br />
            Brighter Tomorrow
          </p>
        </div>
      </div>
    </section>
  )
}
