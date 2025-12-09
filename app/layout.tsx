import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '../styles/invoice-print.css'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { UserMenu } from '@/components/auth/UserMenu'
import Link from 'next/link'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
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
    <html lang="en" className={inter.variable}>
      <body className="font-inter">
        <AuthProvider>
          {/* Header - hidden when printing */}
          <header className="bg-white border-b print:hidden">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Link href="/" className="font-semibold text-lg">
                  Simple Invoice
                </Link>
                <nav className="hidden sm:flex gap-4">
                  <Link
                    href="/contacts"
                    className="text-sm text-gray-600 hover:text-gray-900"
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
