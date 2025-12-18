import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ContactsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="font-display text-3xl text-ink mb-8">Contacts</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/contacts/business"
            className="block p-6 bg-white rounded-xl border border-border shadow-soft hover:shadow-md transition-shadow"
          >
            <h2 className="font-display text-xl text-ink mb-2">Business Profiles</h2>
            <p className="text-ink-muted text-sm">
              Manage your business information that appears in the &quot;From&quot; section of invoices.
            </p>
          </Link>

          <Link
            href="/contacts/clients"
            className="block p-6 bg-white rounded-xl border border-border shadow-soft hover:shadow-md transition-shadow"
          >
            <h2 className="font-display text-xl text-ink mb-2">Clients</h2>
            <p className="text-ink-muted text-sm">
              Manage your client list for the &quot;To&quot; section of invoices.
            </p>
          </Link>

          <Link
            href="/contacts/banking"
            className="block p-6 bg-white rounded-xl border border-border shadow-soft hover:shadow-md transition-shadow"
          >
            <h2 className="font-display text-xl text-ink mb-2">Banking Details</h2>
            <p className="text-ink-muted text-sm">
              Manage your bank account information for the payment section of invoices.
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-accent hover:text-accent-soft transition-colors">
            ← Back to Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}
