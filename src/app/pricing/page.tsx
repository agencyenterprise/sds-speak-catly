'use client'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingPage } from 'sds-projects'

const features = [
  'Accent analysis',
  'Pronunciation improvement',
  'Regional access',
  'Exam score',
  'CEFR level assessment',
]

export default function Pricing() {
  return (
    <main>
      <Header />
      <PricingPage
        customTheme={{
          colors: {
            text: 'text-white',
            primaryButton:
              'text-[#401C57] bg-white border border-pink-500 hover:opacity-80',
            secondaryButton: 'cursor-not-allowed text-[#401C57] bg-white/40',
            icon: 'text-pink-500',
            primaryCard: 'bg-[#401C57] text-white',
            secondaryCard: 'bg-[#6F216E]',
            badge: 'text-pink-400 bg-pink-100/20',
          },
        }}
        freeTierFeatures={features}
      />
      <Footer />
    </main>
  )
}
