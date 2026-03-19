import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Search } from 'lucide-react'
import { ButtonGroup, ButtonGroupText, ButtonGroupSeparator } from './button-group'
import { Button } from './button'
import { Input } from './input'

const meta: Meta = {
  title: 'UI/ButtonGroup',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Back</Button>
      <Button variant="outline">Next</Button>
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Cut</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Paste</Button>
    </ButtonGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Option A</Button>
      <Button variant="outline">Option B</Button>
      <Button variant="outline">Option C</Button>
    </ButtonGroup>
  ),
}

export const WithAddonText: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>https://</ButtonGroupText>
      <Input
        className="rounded-none border-x-0 shadow-none focus-visible:ring-0"
        placeholder="example.com"
      />
      <Button>Go</Button>
    </ButtonGroup>
  ),
}

export const SearchGroup: Story = {
  render: () => (
    <ButtonGroup>
      <Input
        className="rounded-r-none border-r-0 shadow-none focus-visible:ring-0"
        placeholder="Search..."
      />
      <Button size="icon" className="rounded-l-none">
        <Search />
      </Button>
    </ButtonGroup>
  ),
}
