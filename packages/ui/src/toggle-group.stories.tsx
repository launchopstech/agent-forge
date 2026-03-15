import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'

const meta: Meta<typeof ToggleGroup> = {
  title: 'UI/ToggleGroup',
  component: ToggleGroup,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ToggleGroup>

export const Default: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Left aligned">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center aligned">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right aligned">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="monthly">
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 items-start">
      <ToggleGroup type="single" size="sm" defaultValue="b">
        <ToggleGroupItem value="a">Small A</ToggleGroupItem>
        <ToggleGroupItem value="b">Small B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="default" defaultValue="b">
        <ToggleGroupItem value="a">Default A</ToggleGroupItem>
        <ToggleGroupItem value="b">Default B</ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup type="single" size="lg" defaultValue="b">
        <ToggleGroupItem value="a">Large A</ToggleGroupItem>
        <ToggleGroupItem value="b">Large B</ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
}
