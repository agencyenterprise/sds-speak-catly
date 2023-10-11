'use client'

import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import { FaCheck } from 'react-icons/fa6'
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
      <PricingPage
        customTheme={{
          colors: {
            badge: 'bg-blue-300',
            primaryButton: 'bg-blue-500 hover:bg-blue-600 text-white',
            firstUniqueText: 'text-blue-500',
            secondUniqueText: 'text-blue-500',
            text: 'text-gray-700',
            secondaryButton:
              'text-blue-500 ring-1 ring-inset ring-blue-500 hover:ring-blue-600 focus-visible:outline-blue-600 hover:bg-blue-50',
            icon: 'text-blue-500',
          },
        }}
        freeTierFeatures={features}
      />
      <Footer />
    </main>
  )
}
