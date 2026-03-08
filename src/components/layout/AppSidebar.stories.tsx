import type { Meta, StoryObj } from '@storybook/react'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'

const meta: Meta<typeof AppSidebar> = {
  title: 'Layout/AppSidebar',
  component: AppSidebar,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
  decorators: [
    (Story) => (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Story />
          <SidebarInset>
            <div className="p-6">
              <h1 className="text-xl font-bold text-foreground">Page content</h1>
              <p className="mt-2 text-muted-foreground">Main content area</p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AppSidebar>

export const Expanded: Story = {
  args: {},
}

export const Collapsed: Story = {
  decorators: [
    (Story) => (
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full">
          <Story />
          <SidebarInset>
            <div className="p-6">
              <h1 className="text-xl font-bold text-foreground">Page content</h1>
              <p className="mt-2 text-muted-foreground">Sidebar is collapsed to icon-only mode</p>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    ),
  ],
  args: {},
}
