import { Leaf } from "lucide-react"

export const metadata = {
  title: "About — SkinCare AI",
  description: "Learn about SkinCare AI's mission to help people understand visible skin concerns.",
}

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="py-16 md:py-20 surface-teal">
        <div className="container max-w-3xl">
          <div className="icon-badge icon-badge-teal h-12 w-12 rounded-full mb-6">
            <Leaf className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">About Us</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground tracking-tight mb-6">
            Helping people understand their skin
          </h1>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              SkinCare AI was built to make AI-assisted skin insights approachable and easy to understand.
              We combine computer-vision analysis with clear, plain-language explanations so people can
              better understand visible skin concerns and know when to seek professional care.
            </p>
            <p>
              Our platform is informational, not diagnostic. Every analysis is designed to complement — not
              replace — the guidance of a qualified dermatologist or healthcare provider.
            </p>
            <p>
              We also help you track your skin journey over time, keep prescriptions and medical documents
              organized in one place, and find nearby hospitals and clinics when you need them.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
