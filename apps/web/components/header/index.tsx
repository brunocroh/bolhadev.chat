import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ProfileButton from '@/app/auth/components/profile-button'
import { User } from '@supabase/supabase-js'
import { HeaderCTA } from './HeaderCTA'

type Header = {
  user: User | null
}

export const Header: React.FC<Header> = ({ user }: Header) => {
  const authenticated = !!user

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
            <HeaderCTA />
          )}
        </div>
      </div>
    </nav>
  )
}
