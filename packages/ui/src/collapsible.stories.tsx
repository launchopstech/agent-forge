import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ChevronsUpDown } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Collapsible',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[350px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Collapsible>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown className="size-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 text-sm font-mono mt-2">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2 mt-2">
        <div className="rounded-md border px-4 py-3 text-sm font-mono">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-3 text-sm font-mono">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <Collapsible defaultOpen>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Advanced Options</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <ChevronsUpDown className="size-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-2">
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          These options are shown by default since the collapsible is open.
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
