import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClientList } from '@/components/contacts/ClientList'
import Link from 'next/link'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/contacts" className="text-blue-600 hover:underline text-sm">
            ← Back to Contacts
          </Link>
        </div>
        <ClientList />
      </div>
    </div>
  )
}
