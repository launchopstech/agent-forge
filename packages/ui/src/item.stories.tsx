import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { MoreHorizontal, FileText, Image, Music } from 'lucide-react'
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from './item'
import { Button } from './button'
import { Badge } from './badge'

const meta: Meta = {
  title: 'UI/Item',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Item>
      <ItemMedia variant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Document.pdf</ItemTitle>
        <ItemDescription>2.4 MB · Updated 2 hours ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal />
        </Button>
      </ItemActions>
    </Item>
  ),
}

export const Outline: Story = {
  render: () => (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Image />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>photo.jpg</ItemTitle>
        <ItemDescription>4.1 MB · JPEG image</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="secondary">New</Badge>
      </ItemActions>
    </Item>
  ),
}

export const List: Story = {
  render: () => (
    <ItemGroup>
      <Item>
        <ItemMedia variant="icon">
          <FileText />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>report.pdf</ItemTitle>
          <ItemDescription>1.2 MB · PDF document</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon">
          <Image />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>banner.png</ItemTitle>
          <ItemDescription>856 KB · PNG image</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemMedia variant="icon">
          <Music />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>podcast.mp3</ItemTitle>
          <ItemDescription>8.7 MB · Audio file</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <Item size="sm">
      <ItemMedia variant="icon">
        <FileText />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Compact item</ItemTitle>
        <ItemDescription>Uses size="sm" for a more compact layout</ItemDescription>
      </ItemContent>
    </Item>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
