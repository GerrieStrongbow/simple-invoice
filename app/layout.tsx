import type { Metadata } from 'next'
import { Instrument_Serif, Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import '../styles/invoice-print.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { UserMenu } from '@/components/auth/UserMenu'
import Link from 'next/link'

// Display font - elegant serif for headings
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

// Body font - modern, clean sans-serif
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

// Mono font - for numbers and data
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Simple Invoice Generator',
  description: 'Create professional invoices with complete flexibility - everything is editable, nothing is mandatory',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="font-body antialiased">
        <AuthProvider>
          {/* Header - refined, minimal */}
          <header className="no-print border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <Link
                  href="/"
                  className="font-display text-xl text-ink tracking-tight hover:text-accent transition-colors"
                >
                  Simple Invoice
                </Link>
                <nav className="hidden sm:flex gap-6">
                  <Link
                    href="/contacts"
                    className="text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    Contacts
                  </Link>
                </nav>
              </div>
              <UserMenu />
            </div>
          </header>

          {/* Main content */}
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
