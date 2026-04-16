import type { FaqItem } from '../types'

export const faqItems: FaqItem[] = [
  {
    question: 'Do you work with early-stage startups?',
    answer:
      "Yes. Most clients come to us pre-seed to Series A — we're used to shaping products before the team is fully built.",
  },
  {
    question: 'Can we own the code?',
    answer: "Yes, always. You own the repository from day one. We don't hold code hostage.",
  },
  {
    question: 'What if we already have a design?',
    answer:
      "We'll work from your Figma. We prefer this — it removes a design round and accelerates build.",
  },
  {
    question: 'Do you use AI tools to write code?',
    answer:
      'Yes, assisted by AI coding tools, but all output is reviewed and owned by engineers. We ship quality code, not generated noise.',
  },
  {
    question: 'What if we need to change scope mid-build?',
    answer:
      'We have a structured scope-change process: you submit a change request, we estimate impact, you approve before we build. Nothing sneaks in.',
  },
  {
    question: 'Can you integrate with our existing backend?',
    answer:
      "We prefer building on our stack for speed, but we can target an existing API. We'll flag complexity honestly in the Discovery Sprint.",
  },
  {
    question: 'How quickly can we start?',
    answer:
      'Discovery Sprint can start within 2 weeks of signing. MVP Build starts immediately after Discovery approval.',
  },
  {
    question: 'Do you offer post-launch support?',
    answer:
      '30-day support is included. Beyond that we offer a retainer model covering bug fixes, feature additions, and monitoring.',
  },
]
