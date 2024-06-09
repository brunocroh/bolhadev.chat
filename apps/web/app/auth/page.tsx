import React from 'react'
import GithubSignIn from './components/GithubSignIn'

export default function Page(): JSX.Element {
  return (
    <div className="mt-16 flex w-full max-w-2xl flex-col items-center gap-6 self-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-sm text-slate-100">Sign in your account</p>
      </div>
      <div className="w-full max-w-sm">
        <GithubSignIn />
      </div>
    </div>
  )
}
