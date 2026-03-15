import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {}

export const Checked: Story = {
  args: { defaultChecked: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const DisabledChecked: Story = {
  args: { disabled: true, defaultChecked: true },
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const CheckboxGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="option-a" defaultChecked />
        <Label htmlFor="option-a">Option A</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="option-b" />
        <Label htmlFor="option-b">Option B</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="option-c" disabled />
        <Label htmlFor="option-c">Option C (disabled)</Label>
      </div>
    </div>
  ),
}

export const Dark: Story = {
  ...WithLabel,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
