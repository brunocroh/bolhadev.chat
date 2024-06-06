import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import GithubCorner from './github-corner'

export const Header = () => {
  return (
    <nav className="container z-10 flex items-start justify-between p-5">
      <Link href="/">
        <Image
          src="/full-logo.png"
          width={101}
          height={42}
          alt="BolhaDEV.chat logo featuring a stylized globe and a speech bubble with a language symbol on a dark background."
        ></Image>
      </Link>
      <Link href="https://github.com/brunocroh/bolhadev.chat">
        <GithubCorner />
      </Link>
    </nav>
  )
}
