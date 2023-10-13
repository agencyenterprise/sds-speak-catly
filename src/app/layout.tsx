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
    template: '%s - SpeakCatly',
    default: 'Speak Catly - Improve your pronunciation',
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || ''),
  description:
    'Sharpen your pronunciation skills with the assistance of a purrfectly trained AI',
  twitter: {
    card: 'summary_large_image',
    title: 'Speak Catly - Improve your pronunciation',
    description:
      'Sharpen your pronunciation skills with the assistance of a purrfectly trained AI',
    images: 'https://i.ibb.co/Ydftp5Q/Screenshot-3.png',
  },
  openGraph: {
    type: 'website',
    url: 'https://speakcatly.com/',
    title: 'Speak Catly - Improve your pronunciation',
    description:
      'Sharpen your pronunciation skills with the assistance of a purrfectly trained AI',
    images: 'https://i.ibb.co/Ydftp5Q/Screenshot-3.png',
  },
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
      <body className='flex h-full flex-col'>
        <RecoilWrapper>
          <NextAuthProvider>
            <SDSWrapper>{children}</SDSWrapper>
          </NextAuthProvider>
        </RecoilWrapper>
      </body>
    </html>
  )
}
