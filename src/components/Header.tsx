'use client'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'

export default function Header() {
  return (
    <header className='py-10'>
      <Container>
        <nav className='relative z-50 flex justify-between'>
          <div className='flex items-center md:gap-x-12'>
            <Logo className='h-10 w-auto' />
            <h1>Meow Metrics</h1>
          </div>
        </nav>
      </Container>
    </header>
  )
}
