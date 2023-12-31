'use client'

import {
  BuildingOfficeIcon,
  HomeIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

import { SdsNavbar } from 'sds-projects'

const navigation = [
  { name: 'Home', page: '/', icon: HomeIcon },
  { name: 'How It Works', page: '/how-it-works', icon: QuestionMarkCircleIcon },
  { name: 'Pricing', page: '/pricing', icon: CurrencyDollarIcon },
  {
    name: 'Who made this?',
    page: '/who-made-this',
    icon: BuildingOfficeIcon,
  },
]

export function SDSWrapper({ children }: { children: React.ReactNode }) {
  const { data } = useSession()

  const userSession = {
    data: {
      user: {
        name: data?.user?.name,
        email: data?.user?.email,
      },
      token: {
        image: data?.user?.image,
      },
    },
  }

  function handleSignOut() {
    signOut()
    redirect('/login')
  }

  return (
    <SdsNavbar
      projectName='Speak Catly'
      hideUserMenu={!data}
      navigation={navigation}
      userSession={userSession}
      hideYourProfileButton
      hideSettingsButton
      onSignOut={handleSignOut}
    >
      <div className='h-full w-full'>{children}</div>
    </SdsNavbar>
  )
}
