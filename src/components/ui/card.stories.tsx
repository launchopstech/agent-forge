import type { Meta, StoryObj } from '@storybook/react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { SkeletonAvatar, SkeletonText, SkeletonBlock } from './skeleton'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent>Empty card</CardContent>
    </Card>
  ),
}

export const WithHeaderFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>A short description of what this card is about.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">This is the main content area of the card.</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">Confirm</Button>
        <Button size="sm" variant="outline">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const LoadingSkeleton: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="md" />
          <div className="flex flex-col gap-2 flex-1">
            <SkeletonBlock height="h-4" className="w-1/3" />
            <SkeletonBlock height="h-3" className="w-1/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <SkeletonText lines={3} />
      </CardContent>
      <CardFooter>
        <SkeletonBlock height="h-9" className="w-24" />
      </CardFooter>
    </Card>
  ),
}
