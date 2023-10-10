'use client'

import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'

import { SdsNavbar } from 'sds-projects'

const navigation = [
  { name: 'Home', page: '/', icon: HomeIcon },
  { name: 'Pricing', page: '/pricing', icon: CurrencyDollarIcon },
  {
    name: 'Who made this?',
    page: '/who-made-this',
    icon: BuildingOfficeIcon,
  },
]

export function SDSWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  console.log(session)
  function handleSignOut() {
    signOut()
  }

  return (
    <SdsNavbar
      projectName='Chatty Cat'
      navigation={navigation}
      userSession={{ user: '' }}
      onSignOut={handleSignOut}
    >
      <div className='w-full overflow-auto'>{children}</div>
    </SdsNavbar>
  )
}
