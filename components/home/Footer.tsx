"use client"

import Link from "next/link"
import { Leaf, Mail, Github, Twitter, Linkedin, Instagram } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Skin Analysis", href: "/diagnosis" },
    { label: "History", href: "/history" },
    { label: "Prescriptions", href: "/prescription" },
    { label: "Find Hospital", href: "/hospitals" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Medical Disclaimer", href: "/#disclaimer" },
  ],
}

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Sameer9823/skincare-ai", icon: Github },
  { label: "Twitter", href: "https://twitter.com/your-handle", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com/company/your-company", icon: Linkedin },
  { label: "Instagram", href: "https://instagram.com/your-handle", icon: Instagram },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="icon-badge icon-badge-teal h-9 w-9 rounded-full">
                <Leaf className="h-[18px] w-[18px]" />
              </span>
              <span className="text-foreground font-semibold">
                SkinCare <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              AI-assisted skin analysis designed to help you understand visible skin concerns
              and track your skin journey.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/50 transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <nav aria-label="Product">
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal">
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkinCare AI. All rights reserved.
          </p>
          <a
            href="mailto:hello@skincareai.com"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            hello@skincareai.com
          </a>
        </div>
      </div>
    </footer>
  )
}