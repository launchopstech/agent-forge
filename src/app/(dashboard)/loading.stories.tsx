import type { Meta, StoryObj } from '@storybook/react'
import DashboardLoading from './loading'

const meta: Meta<typeof DashboardLoading> = {
  title: 'Loading/DashboardLoading',
  component: DashboardLoading,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof DashboardLoading>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
