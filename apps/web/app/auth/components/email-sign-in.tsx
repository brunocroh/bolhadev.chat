'use server'

import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { InputPassword } from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/server'

export default async function EmailSignIn() {
  async function emailSignIn(formData: FormData) {
    'use server'

    const supabase = createClient()

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const result = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (result.error || !result.data.user) {
      console.log('error')
      return
    }

    redirect('/room/queue')
  }

  return (
    <form action={emailSignIn} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Label className="mb-2">Email</Label>
        <Input
          autoComplete="email"
          name="email"
          className="z-10 rounded-xl border-white/10 px-3 py-5 placeholder-slate-500"
          placeholder="Type your email"
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2">Password</Label>
        <InputPassword />
      </div>
      <Link href="recovery-password">
        <div className="flex w-full justify-end p-1">
          <span className="text-normal text-right text-slate-400 underline">
            Forgot your password?
          </span>
        </div>
      </Link>
      <Button className="w-full rounded-xl bg-indigo-800 py-6 text-lg text-white">
        Sign in
      </Button>
    </form>
  )
}
