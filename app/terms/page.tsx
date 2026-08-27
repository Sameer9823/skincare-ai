export const metadata = {
  title: "Terms of Service — SkinCare AI",
}

export default function TermsPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="py-16 md:py-20 bg-[hsl(var(--cream))]">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground tracking-tight mb-6">
            Terms of Service
          </h1>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              By using SkinCare AI, you agree that the platform provides AI-assisted, non-clinical
              information only. It does not diagnose medical conditions, prescribe medication, or replace
              professional medical care.
            </p>
            <p>
              You&apos;re responsible for the accuracy of information you provide and for keeping your
              account credentials secure. Please use the service only for its intended purpose of
              understanding visible skin concerns and organizing your own medical documents.
            </p>
            <p>
              We may update these terms from time to time. Continued use of the platform after changes
              constitutes acceptance of the updated terms.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
