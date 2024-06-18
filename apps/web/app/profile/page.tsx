import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/server'
import SignOut from '../auth/components/sign-out'

export default async function Page(): JSX.Element {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  const user = data?.user

  return (
    <div className="mt-16 flex w-full flex-col items-center gap-6 self-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="flex w-full justify-center">
          <Image
            className="border-1 rounded-full border-white"
            src={user?.user_metadata.avatar_url}
            height={82}
            width={82}
          />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label>Nome</Label>
          <Input value={user?.user_metadata.full_name} />
        </div>
        <div className="flex w-full flex-col gap-2">
          <Label>Username</Label>
          <Input value={user?.user_metadata.user_name} />
        </div>
      </div>
    </div>
  )
}
