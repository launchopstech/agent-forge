// PROVIDER-SPECIFIC: This page uses Clerk's hosted SignUp UI.
// When changing NEXT_PUBLIC_AUTH_PROVIDER, replace <SignUp /> with your
// provider's sign-up form or SDK component.
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return <SignUp />
}
