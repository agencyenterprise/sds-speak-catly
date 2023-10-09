import './globals.css'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import { type Metadata } from 'next'
import Script from 'next/script'
import NextAuthProvider from '@/lib/providers/next.auth.provider'
import { SdsProjects } from 'sds-projects'
import { SdsNavbar } from 'sds-projects'
import { SDSWrapper } from '@/components/SdsWrapper'
import { RecoilRoot } from 'recoil'
import { RecoilWrapper } from '@/components/RecoilWrapper'

export const metadata: Metadata = {
  title: {
    template: '%s - Chatty Cat',
    default:
      'Chatty Cat - Improve your pronunciation',
  },
  description:
    'Chatty Cat - Improve your pronunciation',
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
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <head>
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js"></Script>
      </head>
      <body className="flex flex-col h-full">
        <RecoilWrapper>
          <NextAuthProvider>
            <SDSWrapper>
              {children}
            </SDSWrapper>
          </NextAuthProvider>
        </RecoilWrapper>
      </body>
    </html>
  )
}
