'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'

export const HeaderCTA = () => {
  const pathName = usePathname()

  if (pathName.includes('sign-up')) {
    return null
  }

  if (pathName.includes('auth')) {
    return (
      <div className="flex items-center gap-4">
        <span>Don&apos;t have an account?</span>
        <Link href="auth/sign-up" className="invisible self-center md:visible">
          <Button className="rounded-xl p-6 text-zinc-800">
            <span className="mr-1 text-base leading-6">Register now</span>
            <ArrowRight />
          </Button>
        </Link>
      </div>
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
