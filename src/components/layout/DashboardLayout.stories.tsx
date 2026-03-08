import type { Meta, StoryObj } from '@storybook/react'
import { DashboardLayout } from './DashboardLayout'

const meta: Meta<typeof DashboardLayout> = {
  title: 'Layout/DashboardLayout',
  component: DashboardLayout,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof DashboardLayout>

const SampleContent = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-foreground">Page Content</h1>
    <p className="text-muted-foreground">This is the main content area.</p>
    <div className="rounded-lg border border-border bg-card p-6">
      <p className="text-sm text-muted-foreground">Content block</p>
    </div>
  </div>
)

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
}

export const WithSidebar: Story = {
  args: {
    children: <SampleContent />,
    showSidebar: true,
    showTopbar: true,
  },
}

export const WithoutSidebar: Story = {
  args: {
    children: <SampleContent />,
    showSidebar: false,
    showTopbar: true,
  },
}
