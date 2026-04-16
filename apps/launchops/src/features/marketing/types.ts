export interface ServiceCard {
  icon: string // lucide icon name
  title: string
  body: string
}

export interface ProcessStep {
  number: number
  title: string
  body: string
  badge: 'required' | 'optional' | 'async'
}

export interface WorkItem {
  title: string
  tagline: string
  body: string
  tags: string[]
  category: string
  slug: string | null
  placeholder?: boolean
}

export interface TechLayer {
  layer: string
  items: string[]
}

export interface PricingTier {
  name: string
  price: string
  duration: string
  features: string[]
  cta: string
  popular?: boolean
}

export interface FaqItem {
  question: string
  answer: string
}
