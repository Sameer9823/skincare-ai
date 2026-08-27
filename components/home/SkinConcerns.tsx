"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const PHOTO_A = "https://images.unsplash.com/photo-1710580889701-9fa8f2cd5927?w=400&q=80&auto=format&fit=crop"
const PHOTO_B = "https://images.unsplash.com/photo-1613829938171-1a6c89d2811c?w=400&q=80&auto=format&fit=crop"

const concerns = [
  {
    id: "acne",
    title: "Acne",
    description: "Breakouts, pimples and blemishes",
    image: "/images/ac.png",
    filter: "saturate-110",
  },
  {
    id: "dark-spots",
    title: "Dark Spots",
    description: "Hyperpigmentation and uneven tone",
    image: "/images/une.png",
    filter: "sepia-[0.15] saturate-125",
  },
  {
    id: "uneven-tone",
    title: "Uneven Skin Tone",
    description: "Patchy or inconsistent skin tone",
    image: "/images/dar.png",
    filter: "sepia-[0.2] contrast-105",
  },
  {
    id: "dryness",
    title: "Dryness",
    description: "Dry, flaky or rough skin",
    image: "/images/dry.png",
    filter: "grayscale-[0.25] brightness-105",
  },
  {
    id: "oiliness",
    title: "Oiliness",
    description: "Excess oil and shine",
    image: "/images/oil.png",
    filter: "brightness-110 contrast-105",
  },
 
]

export function SkinConcerns() {
  return (
    <section id="skin-concerns" className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-md">
            <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">
              Common Skin Concerns
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight">
              Understand What
              <br />
              We Can Help With
            </h2>
          </div>
          <Link
            href="/diagnosis"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Explore All Concerns
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {concerns.map((concern) => (
            <Link
              key={concern.id}
              href={`/diagnosis?concern=${concern.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={concern.image}
                  alt={`${concern.title} skin texture`}
                  fill
                  className={`object-cover ${concern.filter} transition-transform duration-300 group-hover:scale-105`}
                  sizes="180px"
                />
              </div>
              <div className="p-3 space-y-1">
                <h3 className="text-sm font-semibold text-foreground">{concern.title}</h3>
                <p className="text-xs text-muted-foreground leading-snug">{concern.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary pt-1">
                  Learn More
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
