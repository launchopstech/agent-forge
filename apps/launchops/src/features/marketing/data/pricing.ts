import type { PricingTier } from '../types'

export const pricingTiers: PricingTier[] = [
  {
    name: 'Discovery Sprint',
    price: '€ 4,500',
    duration: '2 weeks',
    features: [
      'Requirements document + traceability matrix',
      'Architecture decision records',
      'Wireframes (lo-fi)',
      'Technology recommendation',
      'Itemised build estimate',
    ],
    cta: 'Book a discovery sprint',
  },
  {
    name: 'MVP Build',
    price: 'From € 18,000',
    duration: '6–10 weeks',
    features: [
      'Everything in Discovery Sprint',
      'Full-stack implementation (UI + API + agent layer)',
      'Staging + production deployment',
      '30-day support window',
      'Weekly client updates + milestone reviews',
    ],
    cta: 'Start a project',
    popular: true,
  },
  {
    name: 'Platform license + embedding',
    price: 'Custom',
    duration: 'Ongoing',
    features: [
      'White-label agent-forge platform',
      'Dedicated NestJS API + Python engine deployment',
      'Technical co-founder embedding (weekly async or in-person)',
      'Ongoing delivery partnership',
    ],
    cta: 'Talk to us',
  },
]
