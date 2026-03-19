// PROVIDER-SPECIFIC: This page uses Clerk's hosted SignIn UI.
// When changing NEXT_PUBLIC_AUTH_PROVIDER, replace <SignIn /> with your
// provider's sign-in form or SDK component.
import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return <SignIn />
}
