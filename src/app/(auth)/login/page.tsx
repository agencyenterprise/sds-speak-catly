'use client'
import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { SlimLayout } from '@/components/SlimLayout'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Icon from '@/images/icon.svg'

export default function Login() {
  function handleSignIn() {
    void signIn('google', { callbackUrl: '/' })
  }

  return (
    <SlimLayout>
      <div className='flex flex-col justify-start align-top'>
        <Image src={Icon} alt='logo' width={500} height={500} />
        <h3 className='mb-12 mt-[-3rem] text-center font-display text-lg font-semibold text-primary-500'>
          Welcome to Speak Catly, where you can sharpen your pronunciation
          skills with the assistance of a purrfectly trained AI
        </h3>
        <button
          className='rounded bg-primary-600 px-4 py-2 font-bold text-white hover:bg-primary-700'
          onClick={handleSignIn}
        >
          Login with Google
        </button>
      </div>
    </SlimLayout>
  )
}
