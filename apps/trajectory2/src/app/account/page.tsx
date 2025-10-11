import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AccountForm from './account-form'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-base py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Your Account</h1>
          <p className="text-secondary">Manage your profile and account settings</p>
        </div>
        
        <AccountForm user={data.user} />
      </div>
    </div>
  )
}

