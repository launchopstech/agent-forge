import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url({ message: 'NEXT_PUBLIC_APP_URL must be a valid URL' }),
  NEXT_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production'], {
    message: 'NEXT_PUBLIC_APP_ENV must be one of: development, staging, production',
  }),
})

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
})

if (!parsed.success) {
  const errors = parsed.error.flatten().fieldErrors
  const messages = Object.entries(errors)
    .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
    .join('\n')
  throw new Error(`❌ Missing or invalid environment variables:\n${messages}`)
}

export const env = parsed.data
