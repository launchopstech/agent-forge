import type { ServiceCard } from '../types'

export const services: ServiceCard[] = [
  {
    icon: 'Search',
    title: 'AI-native web apps',
    body: 'End-to-end product design, Next.js front-end, NestJS API, deployed on Vercel + AWS. Built for real users, not demos.',
  },
  {
    icon: 'Bot',
    title: 'Multi-agent workflows',
    body: 'LangGraph orchestration, tool use, memory, and RAG pipelines — connected to your data and your systems.',
  },
  {
    icon: 'Shield',
    title: 'Compliance-ready AI',
    body: 'PII detection, RBAC, audit trails, and GDPR/HIPAA controls built in from day one. Not bolted on later.',
  },
]

export const secondaryServices: string[] = [
  'RAG pipelines',
  'Agent-to-agent handoff protocols',
  'White-label platform licensing',
  'Technical co-founder embedding',
]
