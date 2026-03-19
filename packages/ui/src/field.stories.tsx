import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldSeparator,
  FieldTitle,
} from './field'
import { Input } from './input'
import { Textarea } from './textarea'

const meta: Meta = {
  title: 'UI/Field',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Field>
      <FieldLabel>Email address</FieldLabel>
      <Input type="email" placeholder="you@example.com" />
      <FieldDescription>We'll never share your email with anyone.</FieldDescription>
    </Field>
  ),
}

export const WithError: Story = {
  render: () => (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <Input aria-invalid="true" defaultValue="ab" />
      <FieldError errors={[{ message: 'Username must be at least 3 characters.' }]} />
    </Field>
  ),
}

export const MultipleFields: Story = {
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <Input placeholder="John" />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <Input placeholder="Doe" />
      </Field>
      <Field>
        <FieldLabel>Bio</FieldLabel>
        <Textarea placeholder="Tell us about yourself..." />
        <FieldDescription>Max 160 characters.</FieldDescription>
      </Field>
    </FieldGroup>
  ),
}

export const WithFieldSet: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend>Personal Information</FieldLegend>
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input placeholder="Your name" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldLabel>Handle</FieldLabel>
          <Input placeholder="@yourhandle" />
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}

export const HorizontalOrientation: Story = {
  render: () => (
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldLabel>Notifications</FieldLabel>
        <Input type="checkbox" className="w-4 h-4" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel>
          <FieldTitle>Marketing emails</FieldTitle>
          <FieldDescription>Receive tips and product updates.</FieldDescription>
        </FieldLabel>
        <Input type="checkbox" className="w-4 h-4" />
      </Field>
    </FieldGroup>
  ),
}

export const Dark: Story = {
  ...Default,
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}
