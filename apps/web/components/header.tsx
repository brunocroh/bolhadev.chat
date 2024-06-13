import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SignOut from '@/app/auth/components/SignOut'
import { Button } from '@/components/ui/button'

export const Header = () => {
  return (
    <nav className="w-full border-b border-b-zinc-800 py-6">
      <div className="container flex items-start justify-between">
        <Link href="/">
          <Image
            src="/full-logo.png"
            width={173}
            height={72}
            alt="BolhaDEV.chat logo featuring a stylized globe and a speech bubble with a language symbol on a dark background."
          ></Image>
        </Link>
        <Link href="room/queue" className="invisible self-center md:visible">
          <Button className="rounded-xl p-6 text-zinc-800">
            <span className="mr-1 text-base leading-6">Get started</span>
            <ArrowRight />
          </Button>
        </Link>
        <SignOut />
      </div>
    </nav>
  )
}
