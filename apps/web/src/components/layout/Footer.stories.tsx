import type { Meta, StoryObj } from '@storybook/react'
import { Footer } from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {
  args: {},
}

export const ThreeColumns: Story = {
  args: {
    columns: [
      {
        heading: 'Resources',
        items: [
          { label: 'Docs', href: '#docs' },
          { label: 'API Reference', href: '#api' },
          { label: 'Changelog', href: '#changelog' },
        ],
      },
      {
        heading: 'Support',
        items: [
          { label: 'Status', href: '#status' },
          { label: 'Community', href: '#community' },
        ],
      },
      {
        heading: 'Legal',
        items: [
          { label: 'Privacy', href: '#privacy' },
          { label: 'Terms', href: '#terms' },
        ],
      },
    ],
  },
}

export const Minimal: Story = {
  args: {
    columns: [],
    copyrightText: 'Built with care.',
  },
}
