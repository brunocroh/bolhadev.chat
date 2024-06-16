'use server'

import Image from 'next/image'
import Link from 'next/link'
import { CircleUser } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ProfileButton = {
  name: string
  userName: string
  photo: string
}

export default async function ProfileButton({
  name,
  userName,
  photo,
}: ProfileButton) {
  return (
    <Link href="/profile">
      <Button
        type="submit"
        className="flex h-12 w-full items-center gap-2 rounded-lg text-base font-normal text-black"
      >
        {photo ? (
          <Image
            src={photo}
            width={32}
            height={32}
            className="rounded-full"
            alt="user picture"
          />
        ) : (
          <CircleUser height={32} width={32} />
        )}
        {name ? (
          <div className="flex flex-col justify-start">
            <span className="text-md text-bold leading-2 text-start text-black">
              {name}
            </span>
            <span className="text-normal text-start text-sm leading-none text-gray-700">
              {userName}
            </span>
          </div>
        ) : (
          <div className="flex flex-col justify-start">
            <span className="text-md text-bold leading-2 text-start text-black">
              Complete your profile
            </span>
          </div>
        )}
      </Button>
    </Link>
  )
}
