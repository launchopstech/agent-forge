import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './toast'

const meta: Meta = {
  title: 'UI/Toast',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <div className="grid gap-1">
          <ToastTitle>Scheduled</ToastTitle>
          <ToastDescription>Your message has been sent.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
}

export const Destructive: Story = {
  render: () => (
    <ToastProvider>
      <Toast open variant="destructive">
        <div className="grid gap-1">
          <ToastTitle>Error</ToastTitle>
          <ToastDescription>Something went wrong. Please try again.</ToastDescription>
        </div>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
}

export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <div className="grid gap-1">
          <ToastTitle>Undo available</ToastTitle>
          <ToastDescription>The file has been deleted.</ToastDescription>
        </div>
        <ToastAction altText="Undo file deletion">Undo</ToastAction>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <ToastProvider>
      <Toast open>
        <ToastTitle>Profile updated.</ToastTitle>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
}
