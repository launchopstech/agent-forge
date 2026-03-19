import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = {
  title: 'UI/Popover',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input id="width" defaultValue="100%" className="col-span-2 h-8" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input id="height" defaultValue="25px" className="col-span-2 h-8" />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Simple: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm">Info</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm text-muted-foreground">
          This is some additional information shown in a popover.
        </p>
      </PopoverContent>
    </Popover>
  ),
}

export const AlignStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Align Start</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p className="text-sm">This popover is aligned to the start of the trigger.</p>
      </PopoverContent>
    </Popover>
  ),
}
