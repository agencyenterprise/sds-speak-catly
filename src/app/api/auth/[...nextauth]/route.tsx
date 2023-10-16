import { prisma } from '@/lib/prisma/client'
import type { TokenSet } from '@auth/core/types'
import { PrismaAdapter } from '@auth/prisma-adapter'
import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const scopes = [
  'openid',
  'email',
  'profile ',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: scopes.join(' '),
          prompt: 'consent',
          access_type: 'offline',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      const [google] = await prisma.account.findMany({
        where: { userId: user.id, provider: 'google' },
      })

      if (
        google &&
        google.expires_at &&
        google.expires_at * 1000 < Date.now()
      ) {
        // If the access token has expired, try to refresh it
        try {
          // We need the `token_endpoint`.
          const response = await fetch('https://oauth2.googleapis.com/token', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              grant_type: 'refresh_token',
              refresh_token: google.refresh_token!,
            }),
            method: 'POST',
          })

          const tokens: TokenSet = await response.json()

          if (!response.ok) throw tokens

          const expires_in = tokens.expires_in as number
          await prisma.account.update({
            data: {
              access_token: tokens.access_token,
              expires_at: Math.floor(Date.now() / 1000 + expires_in),
              refresh_token: tokens.refresh_token ?? google.refresh_token,
            },
            where: {
              provider_providerAccountId: {
                provider: 'google',
                providerAccountId: google.providerAccountId,
              },
            },
          })
        } catch (error) {
          console.error('Error refreshing access token', error)
          // The error property will be used client-side to handle the refresh token error
          session.error = 'RefreshAccessTokenError'
        }
      }
      return {
        ...session,
        user: {
          ...session?.user,
          id: user.id,
        },
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
