import type { Meta, StoryObj } from '@storybook/react'
import { FileX2, Inbox, SearchX } from 'lucide-react'

import { Button } from './button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './empty'

const meta = {
  title: 'UI/Empty',
  component: Empty,
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Empty className="max-w-sm border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Inbox />
        </EmptyMedia>
        <EmptyTitle>No messages yet</EmptyTitle>
        <EmptyDescription>When you receive messages they will appear here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithCta: Story = {
  render: () => (
    <Empty className="max-w-sm border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileX2 />
        </EmptyMedia>
        <EmptyTitle>No files found</EmptyTitle>
        <EmptyDescription>Upload your first file to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Upload file</Button>
        <Button variant="outline">Browse templates</Button>
      </EmptyContent>
    </Empty>
  ),
}

export const NoIcon: Story = {
  render: () => (
    <Empty className="max-w-sm border">
      <EmptyHeader>
        <EmptyTitle>No results</EmptyTitle>
        <EmptyDescription>
          Try adjusting your search or filter to find what you&apos;re looking for.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const SearchEmpty: Story = {
  render: () => (
    <Empty className="max-w-sm border">
      <EmptyHeader>
        <EmptyMedia>
          <SearchX className="size-12 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No search results</EmptyTitle>
        <EmptyDescription>
          We couldn&apos;t find anything matching &ldquo;widget&rdquo;. Try a different query.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Clear search
        </Button>
      </EmptyContent>
    </Empty>
  ),
}
