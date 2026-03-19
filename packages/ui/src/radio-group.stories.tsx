import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Label } from './label'

const meta: Meta<typeof RadioGroup> = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof RadioGroup>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="option-1" />
        <Label htmlFor="option-1">Option 1</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="option-2" />
        <Label htmlFor="option-2">Option 2</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" id="option-3" />
        <Label htmlFor="option-3">Option 3</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-start gap-2">
        <RadioGroupItem value="default" id="r-default" className="mt-0.5" />
        <div>
          <Label htmlFor="r-default">Default</Label>
          <p className="text-xs text-muted-foreground">Standard density.</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioGroupItem value="comfortable" id="r-comfortable" className="mt-0.5" />
        <div>
          <Label htmlFor="r-comfortable">Comfortable</Label>
          <p className="text-xs text-muted-foreground">More spacing between items.</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <RadioGroupItem value="compact" id="r-compact" className="mt-0.5" />
        <div>
          <Label htmlFor="r-compact">Compact</Label>
          <p className="text-xs text-muted-foreground">Less spacing, more content.</p>
        </div>
      </div>
    </RadioGroup>
  ),
}

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" id="d-opt-1" />
        <Label htmlFor="d-opt-1">Available option</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" id="d-opt-2" disabled />
        <Label htmlFor="d-opt-2" className="opacity-50">
          Disabled option
        </Label>
      </div>
    </RadioGroup>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
