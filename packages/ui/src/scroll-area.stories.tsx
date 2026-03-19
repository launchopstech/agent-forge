import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ScrollArea, ScrollBar } from './scroll-area'
import { Separator } from './separator'

const meta: Meta<typeof ScrollArea> = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof ScrollArea>

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <figure key={i} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <div className="h-32 w-24 bg-muted flex items-center justify-center text-sm text-muted-foreground">
                {i + 1}
              </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">Photo {i + 1}</figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
}

export const LargeContent: Story = {
  render: () => (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <p className="text-sm leading-relaxed">
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all
        over the place: under the king&apos;s pillow, in his soup, even in the royal toilet. The
        king was furious, but he couldn&apos;t seem to stop Jokester. And then, one day, the people
        of the kingdom discovered that the jokes left by Jokester were so funny that they
        couldn&apos;t help but laugh. The king, seeing his subjects happy, realized the value of
        laughter, and -from that day forward- he accepted Jokester as a member of his court.
      </p>
      <p className="mt-4 text-sm leading-relaxed">
        This is additional content to demonstrate vertical scrolling. The scroll area will show a
        scrollbar when the content exceeds the container height.
      </p>
    </ScrollArea>
  ),
}
