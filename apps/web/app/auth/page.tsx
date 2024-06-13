import React from 'react'
import GithubSignIn from './components/github-sign-in'
import { Separator } from '@/components/ui/separator'
import EmailSignIn from './components/email-sign-in'

export default function Page(): JSX.Element {
  return (
    <div className="mt-16 flex w-full max-w-sm flex-col px-6 items-center gap-6 self-center">
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-sm text-slate-100">Sign in your account</p>
      </div>
      <div className="w-full">
        <GithubSignIn />
      </div>
      <div className="flex w-full items-center gap-3">
        <div className="w-full">
          <Separator/>
        </div>
        <span>OR</span>
        <div className="w-full text-xs text-slate-200">
          <Separator/>
        </div>
      </div>
      <div className="w-full">
        <EmailSignIn />
      </div>
    </div>
  )
}
