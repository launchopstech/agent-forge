// PROVIDER-SPECIFIC: <UserButton /> is a Clerk UI component.
// When changing NEXT_PUBLIC_AUTH_PROVIDER, replace this with your provider's
// avatar/logout control, or build one using useUser() from @/hooks/use-user.
import { DashboardLayout } from '@/components/layout'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { UserButtonClient } from '@/components/auth/UserButtonClient'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      topbarRightSlot={
        <>
          <LocaleSwitcher />
          <UserButtonClient />
        </>
      }
    >
      {children}
    </DashboardLayout>
  )
}
