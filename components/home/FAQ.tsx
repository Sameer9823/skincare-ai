"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "How does the AI skin analysis work?",
    answer:
      "Our AI analyzes uploaded skin images using computer vision models trained on dermatological data. It evaluates visual characteristics like texture, color, borders, and patterns to provide an assessment with confidence levels. The analysis is non-clinical and designed to help you understand visible skin concerns, not to provide medical diagnoses.",
  },
  {
    question: "Is the AI diagnosis medically definitive?",
    answer:
      "No. The AI provides a preliminary, non-clinical assessment based on visual analysis only. It cannot replace an in-person examination by a qualified dermatologist. Results should be used as information to discuss with your doctor, not as a definitive medical diagnosis.",
  },
  {
    question: "Can I upload my prescription?",
    answer:
      "Yes. You can securely upload prescription documents, doctor notes, and medical records. You can optionally add the doctor's name and clinic for better organization, and documents are only accessible to you.",
  },
  {
    question: "Can the AI prescribe medicines?",
    answer:
      "No. The application does not generate medical prescriptions, dosages, or treatment plans. All medical prescriptions must come from qualified healthcare professionals — this platform is for information and document organization only.",
  },
  {
    question: "Is my skin image stored?",
    answer:
      "When you run an analysis, the image is processed by our AI service. If you're signed in and save the result, it's stored in your private history, and you can delete any record at any time. We do not use your images for training or share them with third parties.",
  },
  {
    question: "How can I find a nearby hospital?",
    answer:
      "Use the Find Nearby Hospitals feature on this page or visit the Hospitals page. You can search by city or use your device's location to find dermatology clinics near you, complete with ratings, hours, and directions.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-16 md:py-20 bg-[hsl(var(--cream))]">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">
              Frequently Asked Questions
            </p>
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-foreground tracking-tight mb-4">
              Got Questions?
              <br />
              We&apos;ve Got Answers.
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Can&apos;t find your answer?{" "}
              <Link href="/#contact" className="text-primary font-medium hover:text-primary/80">
                Contact us →
              </Link>
            </p>
          </div>

          <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-background shadow-sm">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={faq.question}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium text-foreground">{faq.question}</span>
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40" : "max-h-0"}`}>
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
