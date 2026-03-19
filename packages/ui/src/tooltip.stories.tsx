import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Plus } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Tooltip',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Add item">
          <Plus />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add new item</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const TopPlacement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Tooltip on top</Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>This tooltip appears above</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const BottomPlacement: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Tooltip below</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>This tooltip appears below</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const MultipleTooltips: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Bold">
            B
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Bold (Ctrl+B)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Italic">
            <em>I</em>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Italic (Ctrl+I)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Underline">
            <u>U</u>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Underline (Ctrl+U)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
}
