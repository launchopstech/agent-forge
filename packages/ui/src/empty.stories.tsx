import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Inbox, Search, FileX } from 'lucide-react'
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from './empty'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Empty',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No messages</EmptyTitle>
        <EmptyDescription>Your inbox is empty. Send a message to get started.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithCta: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileX />
        </EmptyMedia>
        <EmptyTitle>No files found</EmptyTitle>
        <EmptyDescription>Upload a file to get started with your project.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upload File</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const SearchEmpty: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          We couldn't find anything matching your search. Try different keywords.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Clear Search</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const NoIcon: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>Nothing here yet</EmptyTitle>
        <EmptyDescription>Items you add will appear here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
