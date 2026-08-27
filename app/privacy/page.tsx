export const metadata = {
  title: "Privacy Policy — SkinCare AI",
}

export default function PrivacyPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="py-16 md:py-20 bg-[hsl(var(--cream))]">
        <div className="container max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground tracking-tight mb-6">
            Privacy Policy
          </h1>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We take the privacy of your account, images, and medical documents seriously. Uploaded skin
              images are used only to generate your analysis and, if you choose to save a result, to build
              your private history — never to train models or shared with third parties.
            </p>
            <p>
              Prescription and medical documents you upload are stored securely and tied to your account.
              Only you can access your history and documents while signed in.
            </p>
            <p>
              You can delete any saved analysis or document at any time from your account, and you can
              request full deletion of your data by contacting us.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
