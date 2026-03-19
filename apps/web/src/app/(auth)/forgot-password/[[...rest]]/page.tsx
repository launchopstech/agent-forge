// Clerk handles the password reset flow via the SignIn component.
// This page provides a UI shell; Clerk's forgot-password modal renders
// when navigated to from SignIn's "Forgot password?" link.
import { SignIn } from '@clerk/nextjs'

export default function ForgotPasswordPage() {
  return <SignIn />
}
