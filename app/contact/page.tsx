import { Mail } from "lucide-react"

export const metadata = {
  title: "Contact — SkinCare AI",
  description: "Get in touch with the SkinCare AI team.",
}

export default function ContactPage() {
  return (
    <main className="bg-background min-h-screen">
      <section className="py-16 md:py-20 surface-violet">
        <div className="container max-w-3xl">
          <div className="icon-badge icon-badge-blue h-12 w-12 rounded-full mb-6">
            <Mail className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase mb-3">Contact</p>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-foreground tracking-tight mb-6">
            Get in touch
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl">
            Questions about how SkinCare AI works, your account, or a technical issue? Reach out and
            we&apos;ll get back to you as soon as we can.
          </p>
          <a
            href="mailto:hello@skincareai.com"
            className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            <Mail className="h-4 w-4" />
            hello@skincareai.com
          </a>
        </div>
      </section>
    </main>
  )
}
