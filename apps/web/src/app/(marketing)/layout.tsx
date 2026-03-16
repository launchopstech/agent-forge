import { MarketingLayout } from '@/components/layout'
import { marketingNavItems } from '@/config'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <MarketingLayout navItems={marketingNavItems}>{children}</MarketingLayout>
}
