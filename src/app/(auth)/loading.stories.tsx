import type { Meta, StoryObj } from '@storybook/react'
import AuthLoading from './loading'

const meta: Meta<typeof AuthLoading> = {
  title: 'Loading/AuthLoading',
  component: AuthLoading,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof AuthLoading>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
