import React from 'react'
import { Separator } from '@/components/ui/separator'
import EmailSignUp from '../components/email-sign-up'
import GithubSignIn from '../components/github-sign-in'

export default function Page(): JSX.Element {
  return (
    <div className="mt-16 flex w-full max-w-sm flex-col items-center gap-6 self-center px-6">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold">Register</h2>
        <p className="text-sm text-slate-100">Sign up your account</p>
      </div>
      <div className="w-full">
        <GithubSignIn />
      </div>
      <div className="flex w-full items-center gap-3">
        <div className="w-full">
          <Separator />
        </div>
        <span>OR</span>
        <div className="w-full text-xs text-slate-200">
          <Separator />
        </div>
      </div>
      <div className="w-full">
        <EmailSignUp />
      </div>
    </div>
  )
}
