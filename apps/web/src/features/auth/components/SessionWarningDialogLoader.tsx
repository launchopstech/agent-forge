'use client'

import dynamic from 'next/dynamic'

// Loaded client-side only — SessionWarningDialog reads sessionStorage on mount.
const SessionWarningDialog = dynamic(
  () => import('./SessionWarningDialog').then((m) => m.SessionWarningDialog),
  { ssr: false }
)

export function SessionWarningDialogLoader() {
  return <SessionWarningDialog />
}
