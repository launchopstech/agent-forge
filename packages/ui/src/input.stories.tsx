import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { placeholder: 'Email address', type: 'email' },
}

export const WithValue: Story = {
  args: { defaultValue: 'shadcn@example.com', type: 'email' },
}

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter your password' },
}

export const Disabled: Story = {
  args: { disabled: true, placeholder: 'Disabled input', defaultValue: 'Cannot edit this' },
}

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'invalid@', placeholder: 'Email' },
}

export const File: Story = {
  args: { type: 'file' },
}

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[320px]">
      <Input type="text" placeholder="Text" />
      <Input type="email" placeholder="Email" />
      <Input type="password" placeholder="Password" />
      <Input type="number" placeholder="Number" />
      <Input type="search" placeholder="Search" />
      <Input disabled placeholder="Disabled" />
    </div>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
