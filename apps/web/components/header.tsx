import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github } from 'lucide-react'

export const Header = () => {
  return (
    <nav className="container z-10 flex items-center justify-between p-5">
      <Link href="/">
        <Image
          src="/full-logo.png"
          width={101}
          height={42}
          alt="BolhaDEV.chat logo featuring a stylized globe and a speech bubble with a language symbol on a dark background."
        ></Image>
      </Link>
      <Link href="https://github.com/brunocroh/bolhadev.chat">
        <h2 className="rounded-lg p-1 hover:bg-white hover:text-black">
          <Github color="currentColor" />
        </h2>
      </Link>
    </nav>
  )
}
