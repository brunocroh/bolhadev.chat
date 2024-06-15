'use server'

import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EmailForm from './email-form'

export default async function EmailSignUp() {
  async function emailSignUp(formData: FormData) {
    'use server'

    const supabase = createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const result = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (result.error || !result.data.user) {
      console.log('error')
      return
    }

    redirect('/auth/email-confirmation')
  }

  return (
    <form action={emailSignUp} className="flex flex-col gap-4">
      <EmailForm submitLabel="Sign Up" />
    </form>
  )
}
