'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

export const HeaderCTA = () => {
  const pathName = usePathname()

  console.log({ pathName })

  if (pathName.includes('auth')) {
    return (
      <Link href="room/queue" className="invisible self-center md:visible">
        <Button className="rounded-xl p-6 text-zinc-800">
          <span className="mr-1 text-base leading-6">Sign Up</span>
          <ArrowRight />
        </Button>
      </Link>
    )
  }

  return (
    <Link href="room/queue" className="invisible self-center md:visible">
      <Button className="rounded-xl p-6 text-zinc-800">
        <span className="mr-1 text-base leading-6">Get started</span>
        <ArrowRight />
      </Button>
    </Link>
  )
}
