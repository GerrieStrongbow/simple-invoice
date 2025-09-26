'use client'

import FlexibleInvoice from '../components/FlexibleInvoice';

export default function Home() {
  return (
    <main>
      <div className="no-print bg-linear-to-br from-[#667eea] to-[#764ba2] px-5 py-16 text-center text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
          <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm md:text-5xl">
            Simple Invoice Generator
          </h1>
          <p className="text-xl font-medium opacity-90 md:text-2xl">
            Create professional invoices in seconds
          </p>
          <p className="max-w-2xl text-base font-light leading-relaxed opacity-90 md:text-lg">
            No signup required. Everything is editable. Perfect for freelancers, small businesses, and anyone who
            needs flexible, professional invoices without restrictions.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold md:text-base">
            <FeatureBadge icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            }>
              100% Free
            </FeatureBadge>
            <FeatureBadge icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            }>
              Everything Editable
            </FeatureBadge>
            <FeatureBadge icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M6 8h.01" />
                <path d="M10 8h.01" />
                <path d="M14 8h.01" />
              </svg>
            }>
              Mobile Friendly
            </FeatureBadge>
            <FeatureBadge icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6,9 6,2 18,2 18,9" />
                <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            }>
              Print to PDF
            </FeatureBadge>
          </div>
        </div>
      </div>

      <FlexibleInvoice />

      <footer className="no-print border-t border-slate-200 bg-slate-50 px-5 py-12 text-slate-600">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="grid gap-10 text-left md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                About Simple Invoice Generator
              </h3>
              <p className="text-sm leading-relaxed">
                Built for small business owners who need professional invoices without the complexity. Every field is
                editable, nothing is mandatory.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Get Support &amp; Share Feedback
              </h3>
              <p className="mb-3 text-sm leading-relaxed">
                Have questions, feature requests, or found a bug? We&apos;d love to hear from you!
              </p>
              <a
                href="mailto:support@simple-invoice.app?subject=Simple%20Invoice%20Generator%20Feedback"
                className="inline-flex items-center gap-2 text-base font-medium text-indigo-500 transition hover:text-indigo-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                support@simple-invoice.app
              </a>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Simple Invoice Generator. Made for small businesses everywhere.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const FeatureBadge = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white">
      {icon}
    </span>
    <span>{children}</span>
  </div>
)
