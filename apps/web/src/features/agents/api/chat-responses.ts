import type { ChatResponse } from '../types'

interface ResponseRule {
  keywords: string[]
  response: string
  confidence: number
}

const RULES: ResponseRule[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response: 'Hello! How can I help you today?',
    confidence: 99,
  },
  {
    keywords: ['refund', 'money back', 'return'],
    response:
      'I can help with your refund request. Could you provide your order number so I can look into it?',
    confidence: 94,
  },
  {
    keywords: ['pricing', 'price', 'cost', 'plan', 'subscription'],
    response:
      'We offer three plans: Starter ($29/mo), Pro ($79/mo), and Enterprise (custom). Which one interests you?',
    confidence: 92,
  },
  {
    keywords: ['help', 'support', 'issue', 'problem'],
    response: "I'm here to help! Could you describe the issue you're experiencing in more detail?",
    confidence: 96,
  },
  {
    keywords: ['order', 'shipping', 'delivery', 'track'],
    response:
      'I can check on your order status. Please share your order number or the email address associated with your account.',
    confidence: 91,
  },
  {
    keywords: ['cancel', 'unsubscribe'],
    response:
      "I'm sorry to hear you'd like to cancel. Before I process that, is there anything I can help resolve?",
    confidence: 88,
  },
  {
    keywords: ['demo', 'meeting', 'schedule', 'call'],
    response:
      "I'd be happy to set up a demo for you. What day and time work best? We have slots available this week.",
    confidence: 90,
  },
  {
    keywords: ['password', 'login', 'account', 'sign in'],
    response:
      'For security, I can send a password reset link to your registered email. Would you like me to do that?',
    confidence: 95,
  },
  {
    keywords: ['thank', 'thanks', 'great', 'awesome'],
    response: "You're welcome! Is there anything else I can help you with?",
    confidence: 99,
  },
  {
    keywords: ['bye', 'goodbye', 'see you'],
    response: "Goodbye! Don't hesitate to reach out if you need anything else. Have a great day!",
    confidence: 99,
  },
]

const DEFAULT_RESPONSE: ChatResponse = {
  content:
    "Thanks for your message. I'm still learning about that topic. Let me connect you with a team member who can help.",
  confidence: 62,
}

/** Match a user message to canned responses using keyword overlap. */
export function matchResponse(userMessage: string): ChatResponse {
  const lower = userMessage.toLowerCase()

  let bestMatch: ResponseRule | null = null
  let bestScore = 0

  for (const rule of RULES) {
    const score = rule.keywords.filter((kw) => {
      // Word-boundary match to avoid "hi" matching "shipping"
      const re = new RegExp(`\\b${kw}\\b`)
      return re.test(lower)
    }).length
    if (score > bestScore) {
      bestScore = score
      bestMatch = rule
    }
  }

  if (bestMatch) {
    return { content: bestMatch.response, confidence: bestMatch.confidence }
  }

  return DEFAULT_RESPONSE
}
