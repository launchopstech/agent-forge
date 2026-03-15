import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Slider } from './slider'

const meta: Meta<typeof Slider> = {
  title: 'UI/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[360px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Slider>

export const Default: Story = {
  args: { defaultValue: [50], max: 100, step: 1 },
}

export const Range: Story = {
  args: { defaultValue: [25, 75], max: 100, step: 1 },
}

export const WithSteps: Story = {
  args: { defaultValue: [50], max: 100, step: 10 },
}

export const Disabled: Story = {
  args: { defaultValue: [50], disabled: true },
}

export const Vertical: Story = {
  render: () => (
    <div className="flex justify-center h-48">
      <Slider defaultValue={[50]} orientation="vertical" max={100} step={1} className="w-auto" />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState([33])
    return (
      <div className="flex flex-col gap-4 w-[360px]">
        <Slider value={value} onValueChange={setValue} max={100} step={1} />
        <p className="text-sm text-muted-foreground text-center">Value: {value[0]}</p>
      </div>
    )
  },
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
