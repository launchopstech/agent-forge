// PROVIDER-SPECIFIC: <UserButton /> is a Clerk UI component.
// When changing NEXT_PUBLIC_AUTH_PROVIDER, replace this with your provider's
// avatar/logout control, or build one using useUser() from @/hooks/use-user.
import { UserButton } from '@clerk/nextjs'
import { DashboardLayout } from '@/components/layout'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      topbarRightSlot={
        <>
          <LocaleSwitcher />
          <UserButton />
        </>
      }
    >
      {children}
    </DashboardLayout>
  )
}
