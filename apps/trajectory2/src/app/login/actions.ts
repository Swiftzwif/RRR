'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import type { LoginCredentials, SignupCredentials } from '@/types/auth'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const credentials: LoginCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(credentials)

  if (error) {
    redirect('/error?message=' + encodeURIComponent('Login failed. Please check your credentials.'))
  }

  // Get redirect URL from form data or default to home
  const redirectTo = (formData.get('redirectTo') as string) || '/'

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const credentials: SignupCredentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(credentials)

  if (error) {
    redirect('/error?message=' + encodeURIComponent('Signup failed. Please try again.'))
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=' + encodeURIComponent('Check your email to confirm your account!'))
}
