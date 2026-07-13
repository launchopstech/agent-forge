// App-owned user menu component.
// When changing NEXT_PUBLIC_AUTH_PROVIDER, this component automatically adapts
// via the auth adapter pattern (uses useUser() from @/hooks/use-user).
import { DashboardLayout } from '@/components/layout'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { UserMenu } from '@/components/auth/UserMenu'
import { requireAuth } from '@forge/auth/server'
import { SessionWarningDialogLoader } from '@/features/auth/components/SessionWarningDialogLoader'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth('/login')

  return (
    <>
      <DashboardLayout
        topbarRightSlot={
          <>
            <LocaleSwitcher />
            <UserMenu initialUser={session.user} />
          </>
        }
      >
        {children}
      </DashboardLayout>
      <SessionWarningDialogLoader />
    </>
  )
}
