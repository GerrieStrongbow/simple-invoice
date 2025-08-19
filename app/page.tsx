'use client'

import FlexibleInvoice from '../components/FlexibleInvoice'

export default function Home() {
  return (
    <main>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 20px',
        textAlign: 'center' as const,
        color: 'white'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '800',
            margin: '0 0 16px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            Simple Invoice Generator
          </h1>
          <p style={{
            fontSize: '24px',
            margin: '0 0 20px 0',
            fontWeight: '400',
            opacity: 0.95
          }}>
            Create professional invoices in seconds
          </p>
          <p style={{
            fontSize: '18px',
            fontWeight: '300',
            opacity: 0.9,
            lineHeight: 1.6,
            maxWidth: '600px',
            margin: '0 auto 32px auto'
          }}>
            No signup required. Everything is editable.
            Perfect for freelancers, small businesses, and anyone who needs
            flexible, professional invoices without restrictions.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap' as const,
            fontSize: '16px',
            fontWeight: '500'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              100% Free
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
              Everything Editable
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M6 8h.01"/>
                <path d="M10 8h.01"/>
                <path d="M14 8h.01"/>
              </svg>
              Mobile Friendly
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6,9 6,2 18,2 18,9"/>
                <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
              Print to PDF
            </div>
          </div>
        </div>
      </div>

      {/* Main Invoice Component */}
      <FlexibleInvoice />

      {/* Footer Section */}
      <footer style={{
        background: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '40px 20px',
        textAlign: 'center' as const,
        color: '#6b7280'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
            textAlign: 'left' as const
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                About Simple Invoice Generator
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                margin: 0
              }}>
                Built for small business owners who need professional invoices
                without the complexity. Every field is editable, nothing is mandatory.
              </p>
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                Get Support & Share Feedback
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: 1.6,
                margin: '0 0 12px 0'
              }}>
                Have questions, feature requests, or found a bug?
                We&apos;d love to hear from you!
              </p>
              <a
                href="mailto:support@simple-invoice.app?subject=Simple%20Invoice%20Generator%20Feedback"
                style={{
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                support@simple-invoice.app
              </a>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: '24px',
            fontSize: '14px',
            color: '#9ca3af'
          }}>
            <p style={{ margin: 0 }}>
              © 2024 Simple Invoice Generator. Made for small businesses everywhere.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
