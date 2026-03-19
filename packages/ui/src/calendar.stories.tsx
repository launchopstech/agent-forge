import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from './calendar'

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

export const Default: Story = {
  render: () => <Calendar mode="single" />,
}

export const WithSelectedDate: Story = {
  render: () => <Calendar mode="single" selected={new Date(2024, 0, 15)} />,
}

export const DropdownCaption: Story = {
  render: () => <Calendar mode="single" captionLayout="dropdown" fromYear={2020} toYear={2030} />,
}

export const RangeSelection: Story = {
  render: () => (
    <Calendar
      mode="range"
      selected={{
        from: new Date(2024, 0, 10),
        to: new Date(2024, 0, 20),
      }}
    />
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
