import React from 'react'
import SignOut from '../auth/components/sign-out'

export default function Page(): JSX.Element {
  return (
    <div className="mt-16 flex w-full max-w-2xl flex-col items-center gap-6 self-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>
      <div className="w-full max-w-sm">
        <SignOut />
      </div>
    </div>
  )
}
