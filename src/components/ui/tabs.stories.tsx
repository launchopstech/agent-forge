import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-80">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">Manage your account settings.</p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">Change your password here.</p>
      </TabsContent>
    </Tabs>
  ),
}

export const WithCards: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-96">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Account settings content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Password settings content goes here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = React.useState('tab1')

    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Active: {value}</p>
        <Tabs value={value} onValueChange={setValue} className="w-80">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content for Tab 1</TabsContent>
          <TabsContent value="tab2">Content for Tab 2</TabsContent>
          <TabsContent value="tab3">Content for Tab 3</TabsContent>
        </Tabs>
      </div>
    )
  },
}
