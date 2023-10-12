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
        <title>Speak Catly - Improve your pronunciation</title>
        <meta name='title' content='Speak Catly - Improve your pronunciation' />
        <meta
          name='description'
          content='Sharpen your pronunciation skills with the assistance of a purrfectly trained AI'
        />

        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://speakcatly.com/' />
        <meta
          property='og:title'
          content='Speak Catly - Improve your pronunciation'
        />
        <meta
          property='og:description'
          content='Sharpen your pronunciation skills with the assistance of a purrfectly trained AI'
        />
        <meta
          property='og:image'
          content='https://metatags.io/images/meta-tags.png'
        />

        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content='https://speakcatly.com/' />
        <meta
          property='twitter:title'
          content='Speak Catly - Improve your pronunciation'
        />
        <meta
          property='twitter:description'
          content='Sharpen your pronunciation skills with the assistance of a purrfectly trained AI'
        />
        <meta
          property='twitter:image'
          content='https://metatags.io/images/meta-tags.png'
        />

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
