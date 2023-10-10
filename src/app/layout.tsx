import clsx from 'clsx'
import { Inter, Lexend } from 'next/font/google'
import './globals.css'

import { RecoilWrapper } from '@/components/RecoilWrapper'
import { SDSWrapper } from '@/components/SdsWrapper'
import NextAuthProvider from '@/lib/providers/next.auth.provider'
import { type Metadata } from 'next'
import Script from 'next/script'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s - Chatty Cat',
    default: 'Chatty Cat - Improve your pronunciation',
  },
  description: 'Chatty Cat - Improve your pronunciation',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <head>
        <Script src='https://scripts.simpleanalyticscdn.com/latest.js'></Script>
      </head>
      <body className='flex h-full flex-col bg-primary-100'>
        <RecoilWrapper>
          <NextAuthProvider>
            <SDSWrapper>{children}</SDSWrapper>
          </NextAuthProvider>
        </RecoilWrapper>
      </body>
    </html>
  )
}
