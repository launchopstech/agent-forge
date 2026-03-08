import type { Meta, StoryObj } from '@storybook/react'

import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
}

export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/broken.jpg" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
}

export const SizeVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="size-6">
        <AvatarImage src="https://github.com/shadcn.png" alt="sm" />
        <AvatarFallback className="text-xs">SM</AvatarFallback>
      </Avatar>
      <Avatar className="size-8">
        <AvatarImage src="https://github.com/shadcn.png" alt="md" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarImage src="https://github.com/shadcn.png" alt="lg" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="size-16">
        <AvatarImage src="https://github.com/shadcn.png" alt="xl" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
}
