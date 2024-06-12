'use server'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

type ProfileButton = {
  name: string
  userName: string
  photo: string
}

export default async function ProfileButton({ name, userName, photo}: ProfileButton) {
  return (
    <Link href="/profile">
      <Button
        type="submit"
        className="flex h-12 w-full gap-2 rounded-lg items-center text-base font-normal text-black"
      >
        <Image src={photo} width={32} height={32} className="rounded-full" alt="user picture"/>
        <div className="flex flex-col justify-start">
          <span className="text-black text-md text-bold leading-2 text-start">{name}</span>
          <span className="text-gray-700 text-sm text-normal leading-none text-start">{userName}</span>
        </div>
      </Button>
    </Link>
  )
}
