'use client'

import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from '@heroicons/react/24/outline'
import { signIn, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

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
  const { data: session } = useSession();

  return (
    <SdsNavbar projectName="Chatty Cat" hideUserMenu navigation={navigation}>
      <div className="h-[94vh] w-full overflow-auto">{children}</div>
    </SdsNavbar>
  )
}
