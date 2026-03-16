import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Search, Mail, Eye } from 'lucide-react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
  InputGroupButton,
} from './input-group'

const meta: Meta = {
  title: 'UI/InputGroup',
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
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
}

export const WithIconStart: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <Mail className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput type="email" placeholder="you@example.com" />
    </InputGroup>
  ),
}

export const WithButtonEnd: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput type="password" placeholder="Password" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>
          <Eye className="size-4" />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const SearchWithButton: Story = {
  render: () => (
    <InputGroup>
      <InputGroupAddon align="inline-start">
        <Search className="size-4 text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton variant="default" size="xs">
          Go
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
