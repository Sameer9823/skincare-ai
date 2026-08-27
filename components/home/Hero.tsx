"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, Leaf, ShieldCheck, FileCheck2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const stats = [
  { icon: Leaf, label: "AI Assisted Analysis", color: "icon-badge-teal" },
  { icon: ShieldCheck, label: "Your Privacy, Our Priority", color: "icon-badge-blue" },
  { icon: FileCheck2, label: "Trusted Information", color: "icon-badge-violet" },
  { icon: TrendingUp, label: "Better Skin Awareness", color: "icon-badge-amber" },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden surface-teal">
      {/* Soft colorful decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[hsl(var(--brand-blue-soft))] blur-3xl opacity-70" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-[hsl(var(--brand-violet-soft))] blur-3xl opacity-70" />
       
      </div>

      <div className="container relative z-10 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left side - Content */}
          <div className="space-y-6 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-primary uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              AI-Powered Skin Intelligence
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-[3.3rem] leading-[1.1] font-semibold text-foreground tracking-tight text-balance">
              Understand Your Skin.
              <br />
              <span className="text-primary">Make Informed Decisions.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              AI-assisted skin analysis designed to help you understand visible skin concerns
              and track your skin journey.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-1">
              <Link href="/diagnosis">
                <Button size="lg" className="btn-gradient rounded-full px-7 gap-2">
                  Start Skin Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="rounded-full px-7 gap-2 bg-background/80 backdrop-blur border-border">
                  <Play className="h-3 w-3 fill-current" />
                  How It Works
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-6 max-w-lg">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2.5">
                  <span className={`icon-badge ${stat.color} h-8 w-8 shrink-0 rounded-full`}>
                    <stat.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-[4/3] max-w-xl mx-auto rounded-[28px] overflow-hidden bg-[#F4F8F2]">
              <Image
                src="/images/hero.png"
                alt="Woman with healthy natural skin - SkinCare AI"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Handwritten-style accent note */}
            <p className="hidden md:block absolute left-4 bottom-8 -rotate-6 font-display italic text-xl text-[#100062]">
              Healthy Skin,
              <br />
              Happier You
            </p>

            {/* Floating insight card */}
            <div className="hidden md:block absolute md:top-3 md:right-3 lg:top-5 lg:right-5 bg-background/95 backdrop-blur border border-border rounded-lg md:rounded-xl lg:rounded-2xl p-1.5 md:p-2.5 lg:p-3.5 shadow-xl max-w-[104px] md:max-w-[150px] lg:max-w-[190px]">
              <div className="flex items-center gap-1 md:gap-2 lg:gap-2.5 mb-0.5 md:mb-1 lg:mb-1.5">
                <span className="icon-badge icon-badge-teal h-4 w-4 md:h-6 md:w-6 lg:h-7 lg:w-7 rounded-full shrink-0">
                  <Leaf className="h-2 w-2 md:h-3 md:w-3 lg:h-3.5 lg:w-3.5" />
                </span>
                <p className="font-medium text-[9px] md:text-[11px] lg:text-xs text-foreground leading-tight">AI Analysis</p>
              </div>
              <ul className="space-y-0 md:space-y-0.5 text-[8px] md:text-[10px] lg:text-[11px] text-muted-foreground leading-tight lg:leading-snug">
                <li>Personalized Insights</li>
                <li>Healthier Tomorrow</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}