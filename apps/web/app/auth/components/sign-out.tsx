'use server'

import React from 'react'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function SignOut() {
  async function signOut() {
    'use server'

    const supabase = createClient()
    const { error } = await supabase.auth.signOut()

    console.log({ error })

    redirect('/')
  }

  return (
    <form action={signOut}>
      <Button
        type="submit"
        className="flex h-12 w-full gap-2 rounded-full align-top text-base font-normal text-black"
      >
        <span className="items-top flex h-6 justify-end leading-6">Logout</span>
      </Button>
    </form>
  )
}
