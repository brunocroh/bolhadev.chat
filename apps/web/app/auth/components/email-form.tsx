'use client'

import React from 'react'
import Link from 'next/link'
import { InputPassword } from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type EmailForm = {
  submitLabel: string
}

export default function EmailForm({ submitLabel }: EmailForm) {
  return (
    <>
      <div className="flex flex-col">
        <Label className="mb-2">Email</Label>
        <Input
          autoComplete="email"
          name="email"
          className="z-10 rounded-xl border-white/10 px-3 py-5 placeholder-slate-500"
          placeholder="Type your email"
        />
      </div>
      <div className="flex flex-col">
        <Label className="mb-2">Password</Label>
        <InputPassword />
      </div>
      <Link href="recovery-password">
        <div className="flex w-full justify-end p-1">
          <span className="text-normal text-right text-slate-400 underline">
            Forgot your password?
          </span>
        </div>
      </Link>
      <Button className="w-full rounded-xl bg-indigo-800 py-6 text-lg text-white">
        {submitLabel}
      </Button>
    </>
  )
}
