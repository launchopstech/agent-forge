import type { Meta, StoryObj } from '@storybook/react'
import MarketingLoading from './loading'

const meta: Meta<typeof MarketingLoading> = {
  title: 'Loading/MarketingLoading',
  component: MarketingLoading,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof MarketingLoading>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
