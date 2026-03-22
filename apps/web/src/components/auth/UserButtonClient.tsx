'use client'

// PROVIDER-SPECIFIC: wraps Clerk's UserButton with ssr: false to prevent a
// hydration mismatch. Clerk renders a client-side host <div> that doesn't exist
// in the SSR output, which shifts Radix useId counters and causes errors.
import dynamic from 'next/dynamic'

const UserButtonDynamic = dynamic(() => import('@clerk/nextjs').then((m) => m.UserButton), {
  ssr: false,
})

export function UserButtonClient() {
  return <UserButtonDynamic />
}
