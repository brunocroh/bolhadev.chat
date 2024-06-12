import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProfileButton from '@/app/auth/components/profile-button'
import SignOut from '@/app/auth/components/sign-out'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'

type Header = {
  user: User
}

export const Header: React.FC<Header> = ({ user }) => {
  console.log({ user })

  const authenticated = Boolean(user)

  return (
    <nav className="w-full border-b border-b-zinc-800 py-6 pr-6">
      <div className="container flex items-start justify-between">
        <Link href="/">
          <Image
            src="/full-logo.png"
            width={173}
            height={72}
            alt="BolhaDEV.chat logo featuring a stylized globe and a speech bubble with a language symbol on a dark background."
          ></Image>
        </Link>
        <div className="h-full self-center">
          {authenticated ? (
            <ProfileButton
              name={user.user_metadata.name}
              userName={user.user_metadata.preferred_username}
              photo={user.user_metadata.avatar_url}
            />
          ) : (
            <Link
              href="room/queue"
              className="invisible self-center md:visible"
            >
              <Button className="rounded-xl p-6 text-zinc-800">
                <span className="mr-1 text-base leading-6">Get started</span>
                <ArrowRight />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
