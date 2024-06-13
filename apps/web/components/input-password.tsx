'use client'

import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from './ui/input'

export function InputPassword() {
  const [show, setShow] = useState(false)

  const toggleShow = () => {
    setShow((_show) => !_show)
  }

  return (
    <div className="relative w-full">
      <Input
        name="password"
        autoComplete="password"
        type={show ? 'text' : 'password'}
        className="rounded-xl border-white/10 px-3 py-5 placeholder-slate-500"
        placeholder="Type your password"
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-2 top-1.5 z-10 cursor-pointer p-1 text-slate-500"
      >
        {show ? <EyeOff /> : <Eye />}
      </button>
    </div>
  )
}
