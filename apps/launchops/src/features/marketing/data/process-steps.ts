import type { ProcessStep } from '../types'

export const processSteps: ProcessStep[] = [
  {
    number: 1,
    title: 'Brief',
    body: 'You fill a structured intake. We turn it into a scoped requirements doc — no vague Slack threads.',
    badge: 'required',
  },
  {
    number: 2,
    title: 'Kickoff',
    body: 'Stakeholders named. Open questions resolved. Architecture decisions recorded before a line of code.',
    badge: 'required',
  },
  {
    number: 3,
    title: 'Design sprint',
    body: "Wireframes → interactive prototype → sign-off. No building until we've seen it work visually.",
    badge: 'required',
  },
  {
    number: 4,
    title: 'Build',
    body: 'Iterative milestones tracked in Linear. You see the board; we update it weekly.',
    badge: 'async',
  },
  {
    number: 5,
    title: 'Review & approve',
    body: "Every milestone ships with a review link. You approve or give feedback; we don't move on until you do.",
    badge: 'required',
  },
  {
    number: 6,
    title: 'Ship & hand off',
    body: 'Production deployment + runbook + 30-day support window. You own the code on day one.',
    badge: 'required',
  },
]
