import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useTranslations } from 'next-intl'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = {
  title: 'UI/Sheet',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

function LocalizedDefault() {
  const t = useTranslations('ui')
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent closeLabel={t('close')}>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 px-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-name" className="text-right">
              Name
            </Label>
            <Input id="sheet-name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sheet-username" className="text-right">
              Username
            </Label>
            <Input id="sheet-username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export const Default: Story = {
  render: () => <LocalizedDefault />,
}

function LocalizedFromLeft() {
  const t = useTranslations('ui')
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left" closeLabel={t('close')}>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Browse the application sections.</SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-4 px-4">
          <Button variant="ghost" className="justify-start">
            Dashboard
          </Button>
          <Button variant="ghost" className="justify-start">
            Reports
          </Button>
          <Button variant="ghost" className="justify-start">
            Settings
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export const FromLeft: Story = {
  render: () => <LocalizedFromLeft />,
}

function LocalizedFromBottom() {
  const t = useTranslations('ui')
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom" closeLabel={t('close')}>
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>Choose an action to perform.</SheetDescription>
        </SheetHeader>
        <div className="flex gap-2 p-4">
          <Button className="flex-1">Action A</Button>
          <Button variant="outline" className="flex-1">
            Action B
          </Button>
          <SheetClose asChild>
            <Button variant="ghost" className="flex-1">
              Cancel
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export const FromBottom: Story = {
  render: () => <LocalizedFromBottom />,
}
