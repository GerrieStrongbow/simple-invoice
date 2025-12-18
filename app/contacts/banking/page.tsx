import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BankingDetailsList } from '@/components/banking/BankingDetailsList'
import Link from 'next/link'

export default async function BankingDetailsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/contacts" className="text-accent hover:text-accent-soft transition-colors text-sm">
            ← Back to Contacts
          </Link>
        </div>
        <BankingDetailsList />
      </div>
    </div>
  )
}
