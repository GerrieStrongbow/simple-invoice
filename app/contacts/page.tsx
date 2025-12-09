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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">Contacts</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/contacts/business"
            className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">Business Profiles</h2>
            <p className="text-gray-500 text-sm">
              Manage your business information that appears in the &quot;From&quot; section of invoices.
            </p>
          </Link>

          <Link
            href="/contacts/clients"
            className="block p-6 bg-white rounded-lg border hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold mb-2">Clients</h2>
            <p className="text-gray-500 text-sm">
              Manage your client list for the &quot;To&quot; section of invoices.
            </p>
          </Link>
        </div>

        <div className="mt-8">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Invoice
          </Link>
        </div>
      </div>
    </div>
  )
}
