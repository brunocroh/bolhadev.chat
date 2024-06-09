import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Page(): JSX.Element {
  return (
    <div className="mt-16 flex w-full max-w-2xl flex-col items-center gap-6 self-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-sm text-slate-100">Sign in your account</p>
      </div>
      <div className="w-full max-w-sm">
        <Button className="flex h-12 w-full gap-2 rounded-full align-top text-base font-normal text-black">
          <span className="items-top flex h-6 justify-end leading-6">
            Sign in with
          </span>
          <Image src="/github.svg" width="26" height="26" alt="Github logo" />
          <span className="text-xl font-bold">Github</span>
        </Button>
      </div>
    </div>
  )
}
