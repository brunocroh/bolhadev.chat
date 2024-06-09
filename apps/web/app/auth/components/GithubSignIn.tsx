'use server'

import React from 'react'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function GithubSignIn() {
  async function signIn() {
    'use server'

    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // TODO: Move to an env
        redirectTo: 'http://localhost:3000/room/queue',
      },
    })

    if (error) {
      console.log(error)
    }

    if (data.url) {
      redirect(data.url)
    }
  }

  return (
    <form action={signIn}>
      <Button
        type="submit"
        className="flex h-12 w-full gap-2 rounded-full align-top text-base font-normal text-black"
      >
        <span className="items-top flex h-6 justify-end leading-6">
          Sign in with
        </span>
        <Image src="/github.svg" width="26" height="26" alt="Github logo" />
        <span className="text-xl font-bold">Github</span>
      </Button>
    </form>
  )
}
