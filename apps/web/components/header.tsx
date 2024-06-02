import React from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'

export const Header = () => {
  return (
    <nav className="container z-10 flex justify-between p-5">
      <Link href="/">
        <h1 className="text-base font-semibold text-white">Bolhadev.chat</h1>
      </Link>
      <Link href="https://github.com/brunocroh/bolhadev.chat">
        <h2 className="rounded-lg p-1 hover:bg-white hover:text-black">
          <Github color="currentColor" />
        </h2>
      </Link>
    </nav>
  )
}
