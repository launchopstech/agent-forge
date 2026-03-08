import type { Meta, StoryObj } from '@storybook/react'

import { Label } from './label'
import { Input } from './input'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text…' },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2 w-72">
      <Label htmlFor="email-input">Email address</Label>
      <Input id="email-input" type="email" placeholder="you@example.com" />
    </div>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <div className="grid gap-2 w-72">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="jsmith" />
      <p className="text-sm text-muted-foreground">Your unique display name.</p>
    </div>
  ),
}

export const Error: Story = {
  render: () => (
    <div className="grid gap-2 w-72">
      <Label htmlFor="error-input">Email</Label>
      <Input
        id="error-input"
        aria-invalid="true"
        placeholder="bad@email"
        value="bad@email"
        readOnly
      />
      <p className="text-sm text-destructive">Please enter a valid email address.</p>
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: 'Cannot edit', disabled: true },
}
