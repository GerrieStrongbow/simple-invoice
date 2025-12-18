'use client'

import FlexibleInvoice from '../components/FlexibleInvoice';

export default function Home() {
  return (
    <main>
      {/* Hero Section - Refined, minimal, warm */}
      <div className="no-print relative overflow-hidden bg-paper-warm">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-white/50 to-transparent" />

        {/* Decorative accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-accent rounded-b-full" />

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          {/* Main heading with serif font */}
          <h1 className="animate-fade-up font-display text-5xl md:text-6xl text-ink tracking-tight mb-6">
            Simple Invoice Generator
          </h1>

          {/* Subheading */}
          <p className="animate-fade-up animate-delay-1 text-xl md:text-2xl text-ink-soft font-light mb-4">
            Create professional invoices in seconds
          </p>

          {/* Description */}
          <p className="animate-fade-up animate-delay-2 max-w-2xl mx-auto text-base text-ink-muted leading-relaxed mb-10">
            No signup required. Everything is editable. Perfect for freelancers,
            small businesses, and anyone who needs flexible, professional invoices.
          </p>

          {/* Feature badges - refined styling */}
          <div className="animate-fade-up animate-delay-3 flex flex-wrap justify-center gap-4 text-sm">
            <FeatureBadge icon={<CheckIcon />}>100% Free</FeatureBadge>
            <FeatureBadge icon={<EditIcon />}>Everything Editable</FeatureBadge>
            <FeatureBadge icon={<DeviceIcon />}>Mobile Friendly</FeatureBadge>
            <FeatureBadge icon={<PrintIcon />}>Print to PDF</FeatureBadge>
          </div>
        </div>

        {/* Bottom fade to paper background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-paper to-transparent" />
      </div>

      {/* Invoice Editor */}
      <FlexibleInvoice />

      {/* Footer - Clean and minimal */}
      <footer className="no-print border-t border-border bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 mb-12">
            <div>
              <h3 className="font-display text-lg text-ink mb-4">
                About
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Built for small business owners who need professional invoices
                without the complexity. Every field is editable, nothing is mandatory.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg text-ink mb-4">
                Get in Touch
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed mb-4">
                Have questions, feature requests, or found a bug? We&apos;d love to hear from you.
              </p>
              <a
                href="mailto:support@simple-invoice.app?subject=Simple%20Invoice%20Generator%20Feedback"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-soft transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@simple-invoice.app
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center">
            <p className="text-xs text-ink-faint">
              © {new Date().getFullYear()} Simple Invoice Generator
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// Feature badge component - refined styling
const FeatureBadge = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm">
    <span className="text-accent">
      {icon}
    </span>
    <span className="text-ink-soft font-medium">{children}</span>
  </div>
)

// Icons - minimal line style
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 12 2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
)

const DeviceIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <path d="M12 18h.01" />
  </svg>
)

const PrintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6,9 6,2 18,2 18,9" />
    <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
)
