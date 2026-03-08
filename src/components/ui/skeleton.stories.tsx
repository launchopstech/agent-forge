import type { Meta, StoryObj } from '@storybook/react'

import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonBlock } from './skeleton'

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { className: 'h-4 w-48' },
}

export const TextVariant: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      <div>
        <p className="text-xs text-muted-foreground mb-2">2 lines</p>
        <SkeletonText lines={2} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">3 lines (default)</p>
        <SkeletonText />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-2">5 lines</p>
        <SkeletonText lines={5} />
      </div>
    </div>
  ),
}

export const AvatarVariant: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="sm" />
        <span className="text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="md" />
        <span className="text-xs text-muted-foreground">md</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <SkeletonAvatar size="lg" />
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  ),
}

export const CardVariant: Story = {
  render: () => (
    <div className="w-80">
      <SkeletonCard />
    </div>
  ),
}

export const BlockVariant: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-4">
      <SkeletonBlock height="h-12" />
      <SkeletonBlock height="h-24" />
      <SkeletonBlock height="h-48" />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">SkeletonText</p>
        <SkeletonText lines={3} />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">SkeletonAvatar</p>
        <div className="flex gap-4">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">SkeletonCard</p>
        <SkeletonCard />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">SkeletonBlock</p>
        <SkeletonBlock />
      </div>
    </div>
  ),
}
