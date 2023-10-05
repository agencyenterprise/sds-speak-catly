'use client'
import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { signIn } from 'next-auth/react'


export default function Login() {

  function handleSignIn() {
    void signIn();
  }

  return (
    <SlimLayout>
      <div className="flex justify-between flex-col">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSignIn}
        >
          Login with Google
        </button>
      </div>
    </SlimLayout>
  )
}
