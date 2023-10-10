import ReactDOM from 'react-dom'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import logo from '@/images/icon.svg'

interface SpinnerProps {
  useLogo?: boolean
  message?: string
}

export const Spinner = ({ message, useLogo }: SpinnerProps) => {
  return ReactDOM.createPortal(
    <div className='z-100 absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-4 bg-black/70 text-primary-200 backdrop-blur-sm'>
      {useLogo ? (
        <div>
          <Image
            src={logo}
            alt={'AE Studio Logo'}
            className={'h-auto w-full max-w-xs'}
            priority={true}
          />
        </div>
      ) : null}
      <FaSpinner className='animate-spin text-primary-500' size={48} />
      {message ? (
        <div className={'text-2xl text-primary-500'}>{message}</div>
      ) : null}
    </div>,
    document.body,
  )
}

export const InlineSpinner = ({ message }: SpinnerProps) => {
  return (
    <div className={'flex items-center justify-center gap-2'}>
      <FaSpinner className='animate-spin bg-primary-500' size={16} />
      {message ? <span>{message}</span> : null}
    </div>
  )
}
