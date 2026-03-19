import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MarketingLayout } from './MarketingLayout'

const meta: Meta<typeof MarketingLayout> = {
  title: 'Layout/MarketingLayout',
  component: MarketingLayout,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof MarketingLayout>

const SampleContent = () => (
  <section className="flex items-center justify-center py-32 px-6">
    <div className="text-center max-w-xl">
      <h1 className="text-4xl font-bold text-foreground">Hero Heading</h1>
      <p className="mt-4 text-muted-foreground">Sample page content goes here.</p>
    </div>
  </section>
)

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
}

export const WithFooter: Story = {
  args: {
    children: <SampleContent />,
    showFooter: true,
  },
}

export const WithoutFooter: Story = {
  args: {
    children: <SampleContent />,
    showFooter: false,
  },
}
