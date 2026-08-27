import { Metadata } from "next"
import { Hero } from "@/components/home/Hero"
import { Benefits } from "@/components/home/Benefits"
import { HowItWorks } from "@/components/home/HowItWorks"
import { AnalysisPreview } from "@/components/home/AnalysisPreview"
import { SkinConcerns } from "@/components/home/SkinConcerns"
import { ProgressSection } from "@/components/home/ProgressSection"
import { PrescriptionSection } from "@/components/home/PrescriptionSection"
import { HospitalSection } from "@/components/home/HospitalSection"
import { FAQ } from "@/components/home/FAQ"
import { MedicalDisclaimer } from "@/components/home/MedicalDisclaimer"
import { FinalCTA } from "@/components/home/FinalCTA"
import { Footer } from "@/components/home/Footer"

export const metadata: Metadata = {
  title: "SkinCare AI — AI-Assisted Skin Analysis",
  description: "Understand visible skin concerns with AI-assisted analysis, track your skin journey, manage prescriptions, and find nearby healthcare facilities.",
  generator: "SkinCare AI",
  openGraph: {
    title: "SkinCare AI — AI-Assisted Skin Analysis",
    description: "Understand visible skin concerns with AI-assisted analysis, track your skin journey, manage prescriptions, and find nearby healthcare facilities.",
    type: "website",
    locale: "en_US",
    siteName: "SkinCare AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkinCare AI — AI-Assisted Skin Analysis",
    description: "Understand visible skin concerns with AI-assisted analysis, track your skin journey, manage prescriptions, and find nearby healthcare facilities.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      <Benefits />
      <HowItWorks />
      <AnalysisPreview />
      <SkinConcerns />

      <section className="py-14 md:py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <ProgressSection />
            <PrescriptionSection />
            <HospitalSection />
          </div>
        </div>
      </section>

      <MedicalDisclaimer />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
