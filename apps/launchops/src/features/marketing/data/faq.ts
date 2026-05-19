import type { FaqItem } from '../types'

export const faqItems: FaqItem[] = [
  // Getting started
  {
    question: 'How quickly can we start?',
    answer:
      'Discovery Sprint can kick off within 2 weeks of signing. MVP Build starts immediately after Discovery approval — no waiting in a queue.',
  },
  {
    question: 'Do you work with clients who have no technical team?',
    answer:
      'Yes — most of our clients have a product or ops lead but no in-house engineers. We act as the full technical team: architecture, engineering, and deployment. You stay close to the decisions without needing to write code.',
  },
  {
    question: 'Do you work with early-stage startups?',
    answer:
      "Yes. Most clients come to us pre-seed to Series A — we're used to shaping products before the team is fully built.",
  },

  // Scope & timeline
  {
    question: 'How fixed is the 6-week timeline?',
    answer:
      "Very fixed — that's why we run a Discovery Sprint first. We spec and lock scope before writing code. If scope changes mid-build we raise a change order transparently and you approve it before we proceed. Our track record on CampO was 6 weeks from signed brief to production.",
  },
  {
    question: 'What if we need to change scope mid-build?',
    answer:
      'We have a structured scope-change process: you submit a change request, we estimate the impact on timeline and cost, you approve before we build. Nothing sneaks in.',
  },
  {
    question: 'What is not included in a standard engagement?',
    answer:
      'Logo design, brand identity, photography, video production, and paid advertising management are out of scope. For anything outside a signed spec we raise a change order first.',
  },

  // Ownership & IP
  {
    question: 'What do we own at the end of the engagement?',
    answer:
      'Everything. Full IP transfer — you own 100% of the code. You also receive a private GitHub repo, deployment docs, a runbook, an evals suite, and observability dashboards set up in LangSmith and PostHog, plus 30 days of support.',
  },
  {
    question: 'Can we own the code from day one?',
    answer:
      "Yes, always. The repository is in your GitHub organisation from the first commit. We don't hold code hostage.",
  },

  // AI & technology
  {
    question: 'Which AI models do you use?',
    answer:
      "It depends on your latency, cost, and capability requirements. We typically use Claude Sonnet or GPT-4o for reasoning-heavy tasks and faster models for high-volume routing and classification. We design model-agnostic architectures so you're never locked to a single provider.",
  },
  {
    question: 'Do you use AI tools to write code?',
    answer:
      'Yes — we use AI-assisted coding tools throughout the build, but all output is reviewed and owned by engineers. We ship quality code, not generated noise.',
  },
  {
    question: 'Can you integrate with our existing backend or third-party APIs?',
    answer:
      "We prefer building on our stack for speed, but we can target an existing API or data source. We'll surface complexity honestly in the Discovery Sprint so there are no surprises.",
  },

  // Privacy & compliance
  {
    question: 'How do you handle data privacy and GDPR?',
    answer:
      'Compliance is built in from day one. We run a DPIA as part of Discovery, implement PII redaction at the guardrail layer, use audit-logging middleware on all LLM calls, and deliver a compliance pack you can hand directly to a DPO.',
  },

  // Design & existing work
  {
    question: 'What if we already have a design?',
    answer:
      "We'll work directly from your Figma. We prefer this — it removes a design round and accelerates build. If designs need refinement we'll flag it in Discovery.",
  },

  // Support & ongoing work
  {
    question: 'Do you offer post-launch support?',
    answer:
      '30-day support is included in every build. Beyond that we offer a retainer model covering bug fixes, feature additions, performance monitoring, and ongoing development sprints.',
  },
  {
    question: 'Can we extend or add features after launch?',
    answer:
      'Absolutely. We scope follow-on work as discrete sprints or ongoing via our Platform License. Because we wrote the original codebase, iteration is significantly faster than handing it to a new team.',
  },

  // Working style
  {
    question: 'Do you work on-site or remotely?',
    answer:
      "We're async-first and work with clients globally. Key sessions — kickoff, architecture review, weekly demos — happen over video. For enterprise engagements we can arrange on-site workshops where needed.",
  },
  {
    question: 'How many projects do you take on at once?',
    answer:
      'We limit ourselves to 2–3 active builds at any time. This is deliberate — it means your project gets genuine senior attention, not a junior team running in parallel on ten other accounts.',
  },
  {
    question: 'Do you sign NDAs?',
    answer:
      'Yes, happy to sign before you share any details — just ask. Confidentiality is standard practice for us, not an upsell.',
  },
]
