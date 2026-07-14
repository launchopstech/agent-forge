'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSessionStatus } from '@forge/auth/src/adapters/auth-handler/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@forge/ui/src/dialog'
import { Button } from '@forge/ui/src/button'

/**
 * Modal warning shown when the user's session is about to expire due to inactivity.
 * Only renders when sessionStatus === 'expiring'.
 *
 * - "Stay logged in" → silent refresh; closes on success, signs out on failure.
 * - "Log out" → immediate sign-out.
 * - Not closeable via overlay click or Escape — user must choose an action.
 */
export function SessionWarningDialog() {
  const t = useTranslations('sessionWarning')
  // minutesRemaining is updated every 60 s by useSessionStatus() itself —
  // no local interval needed here.
  const { status, minutesRemaining, stayLoggedIn, signOut } = useSessionStatus()

  const handleStayLoggedIn = useCallback(async () => {
    const ok = await stayLoggedIn()
    if (!ok) {
      await signOut()
    }
  }, [stayLoggedIn, signOut])

  const open = status === 'expiring'

  return (
    <Dialog
      open={open}
      // onOpenChange intentionally omitted — dialog cannot be dismissed by
      // overlay click or Escape; user must click "Stay logged in" or "Log out".
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { minutes: minutesRemaining ?? 0 })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => void signOut()}>
            {t('logOut')}
          </Button>
          <Button onClick={() => void handleStayLoggedIn()}>{t('stayLoggedIn')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
