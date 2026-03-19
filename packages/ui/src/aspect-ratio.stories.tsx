import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from './aspect-ratio'

const meta: Meta<typeof AspectRatio> = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const SixteenByNine: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <div className="flex size-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm">
        16 / 9
      </div>
    </AspectRatio>
  ),
}

export const Square: Story = {
  render: () => (
    <AspectRatio ratio={1}>
      <div className="flex size-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm">
        1 / 1
      </div>
    </AspectRatio>
  ),
}

export const FourByThree: Story = {
  render: () => (
    <AspectRatio ratio={4 / 3}>
      <div className="flex size-full items-center justify-center rounded-md bg-muted text-muted-foreground text-sm">
        4 / 3
      </div>
    </AspectRatio>
  ),
}
