'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { notFound } from 'next/navigation'
import {
  Bell,
  CheckCircle,
  FileX2,
  Inbox,
  Info,
  Moon,
  Sun,
  TriangleAlert,
  User,
} from 'lucide-react'

import { useTheme } from '@/hooks/use-theme'
import { getBrand, brandCssVars } from '@forge/brand'

import { Alert, AlertDescription, AlertTitle } from '@forge/ui/src/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@forge/ui/src/avatar'
import { Badge } from '@forge/ui/src/badge'
import { Button } from '@forge/ui/src/button'
import { Checkbox } from '@forge/ui/src/checkbox'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@forge/ui/src/empty'
import { Input } from '@forge/ui/src/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { Separator } from '@forge/ui/src/separator'
import { Skeleton, SkeletonAvatar, SkeletonBlock, SkeletonText } from '@forge/ui/src/skeleton'
import { Switch } from '@forge/ui/src/switch'

const QA_STORAGE_KEY = 'qa-checklist'
const BRAND_STORAGE_KEY = 'preview-brand'

const BRAND_OPTIONS = [
  { key: 'default', label: 'Default (Purple)' },
  { key: 'client-a', label: 'Client A (Blue)' },
  { key: 'client-b', label: 'Client B (Green)' },
] as const

// ---------------------------------------------------------------------------
// Brand external store (useSyncExternalStore pattern — same as checklist)
// ---------------------------------------------------------------------------
let brandListeners: Array<() => void> = []

function subscribeBrand(callback: () => void) {
  brandListeners.push(callback)
  return () => {
    brandListeners = brandListeners.filter((l) => l !== callback)
  }
}

function getBrandSnapshot(): string {
  if (typeof window === 'undefined') return 'default'
  return window.localStorage.getItem(BRAND_STORAGE_KEY) ?? 'default'
}

function getBrandServerSnapshot(): string {
  return 'default'
}

function writeBrand(key: string) {
  try {
    window.localStorage.setItem(BRAND_STORAGE_KEY, key)
  } catch {
    // ignore
  }
  for (const listener of brandListeners) listener()
}

const CHECKLIST_COMPONENTS = [
  'Button',
  'Badge',
  'Avatar',
  'Input',
  'Alert',
  'Empty State',
  'Separator',
  'Skeleton',
  'Switch',
  'Checkbox',
]

const QA_CRITERIA = [
  'Renders in light mode',
  'Renders in dark mode',
  'Mobile responsive (375px)',
  'Keyboard navigable',
  'No console errors',
  'Accessible (axe)',
]

type ChecklistState = Record<string, Record<string, boolean>>

// ---------------------------------------------------------------------------
// localStorage-backed external store (useSyncExternalStore pattern)
// ---------------------------------------------------------------------------
let checklistListeners: Array<() => void> = []

function subscribeChecklist(callback: () => void) {
  checklistListeners.push(callback)
  return () => {
    checklistListeners = checklistListeners.filter((l) => l !== callback)
  }
}

function getChecklistSnapshot(): ChecklistState {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(QA_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ChecklistState) : {}
  } catch {
    return {}
  }
}

function getChecklistServerSnapshot(): ChecklistState {
  return {}
}

function writeChecklist(next: ChecklistState) {
  try {
    window.localStorage.setItem(QA_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
  for (const listener of checklistListeners) listener()
}

// ---------------------------------------------------------------------------

export default function PreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  const { resolvedTheme, toggleTheme } = useTheme()
  const checklist = useSyncExternalStore(
    subscribeChecklist,
    getChecklistSnapshot,
    getChecklistServerSnapshot
  )
  const brandKey = useSyncExternalStore(subscribeBrand, getBrandSnapshot, getBrandServerSnapshot)

  useEffect(() => {
    const brand = getBrand(brandKey)
    const css = brandCssVars(brand)
    let el = document.getElementById('preview-brand-vars')
    if (!el) {
      el = document.createElement('style')
      el.id = 'preview-brand-vars'
      document.head.appendChild(el)
    }
    el.textContent = css
  }, [brandKey])

  const toggle = useCallback((component: string, criterion: string) => {
    const current = getChecklistSnapshot()
    writeChecklist({
      ...current,
      [component]: {
        ...current[component],
        [criterion]: !current[component]?.[criterion],
      },
    })
  }, [])

  const resetChecklist = useCallback(() => {
    writeChecklist({})
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-foreground bg-muted px-2 py-1 rounded">
              DEV
            </span>
            <span className="font-semibold text-sm">Component Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={brandKey} onValueChange={writeBrand}>
              <SelectTrigger className="h-8 w-40 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRAND_OPTIONS.map((opt) => (
                  <SelectItem key={opt.key} value={opt.key} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-2">
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="size-4" /> Light
                </>
              ) : (
                <>
                  <Moon className="size-4" /> Dark
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Catalog */}
        <main className="flex-1 overflow-auto p-6 space-y-12">
          {/* Primitives */}
          <section>
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b">Primitives</h2>

            <div className="space-y-8">
              {/* Buttons */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Button</h3>
                <div className="flex flex-wrap gap-3">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="link">Link</Button>
                  <Button disabled>Disabled</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" variant="outline" aria-label="Bell">
                    <Bell />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Badges */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Badge</h3>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>

              <Separator />

              {/* Avatar */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Avatar</h3>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </section>

          {/* Forms */}
          <section>
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b">Forms</h2>
            <div className="space-y-8 max-w-sm">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Input</h3>
                <div className="space-y-3">
                  <Input placeholder="Default input" />
                  <Input placeholder="Disabled input" disabled />
                  <Input type="email" placeholder="Email address" />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  Switch &amp; Checkbox
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Switch id="switch-1" />
                    <label htmlFor="switch-1" className="text-sm">
                      Toggle feature
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="switch-2" defaultChecked />
                    <label htmlFor="switch-2" className="text-sm">
                      Enabled feature
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="check-1" />
                    <label htmlFor="check-1" className="text-sm">
                      Accept terms
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="check-2" defaultChecked />
                    <label htmlFor="check-2" className="text-sm">
                      Subscribe to updates
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Composite */}
          <section>
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b">Composite</h2>
            <div className="space-y-8">
              {/* Alert */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Alert</h3>
                <div className="space-y-3 max-w-lg">
                  <Alert>
                    <Info className="size-4" />
                    <AlertTitle>Info</AlertTitle>
                    <AlertDescription>This is an informational alert message.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <TriangleAlert className="size-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                  </Alert>
                </div>
              </div>

              <Separator />

              {/* Empty State */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Empty State</h3>
                <div className="flex flex-wrap gap-4">
                  <Empty className="max-w-xs border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Inbox />
                      </EmptyMedia>
                      <EmptyTitle>No messages</EmptyTitle>
                      <EmptyDescription>Messages will appear here.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>

                  <Empty className="max-w-xs border">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <FileX2 />
                      </EmptyMedia>
                      <EmptyTitle>No files</EmptyTitle>
                      <EmptyDescription>Upload your first file.</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button size="sm">Upload</Button>
                    </EmptyContent>
                  </Empty>
                </div>
              </div>

              <Separator />

              {/* Skeleton */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Skeleton</h3>
                <div className="space-y-4 max-w-sm">
                  <div className="flex items-center gap-3">
                    <SkeletonAvatar size="md" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock height="h-4" className="w-1/2" />
                      <SkeletonBlock height="h-3" className="w-1/3" />
                    </div>
                  </div>
                  <SkeletonText lines={3} />
                </div>
              </div>
            </div>
          </section>

          {/* Status indicators */}
          <section>
            <h2 className="text-lg font-semibold mb-6 pb-2 border-b">Status Indicators</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="size-4" />
                <span>Success state</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-destructive">
                <TriangleAlert className="size-4" />
                <span>Error state</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="size-4" />
                <span>Info state</span>
              </div>
            </div>
          </section>
        </main>

        {/* QA Checklist sidebar */}
        <aside
          className="w-72 shrink-0 border-l bg-muted/30 overflow-auto sticky top-14 h-[calc(100vh-3.5rem)]"
          suppressHydrationWarning
        >
          <div className="p-4">
            <h2 className="font-semibold text-sm mb-4">QA Checklist</h2>
            <div className="space-y-6">
              {CHECKLIST_COMPONENTS.map((comp) => (
                <div key={comp}>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    {comp}
                  </h3>
                  <div className="space-y-1.5">
                    {QA_CRITERIA.map((criterion) => {
                      const checked = checklist[comp]?.[criterion] ?? false
                      return (
                        <label
                          key={criterion}
                          className="flex items-start gap-2 cursor-pointer group"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggle(comp, criterion)}
                            className="mt-0.5 shrink-0"
                            id={`${comp}-${criterion}`}
                          />
                          <span
                            className={`text-xs leading-5 ${
                              checked
                                ? 'line-through text-muted-foreground'
                                : 'text-foreground group-hover:text-foreground/80'
                            }`}
                          >
                            {criterion}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs text-muted-foreground"
                  onClick={resetChecklist}
                >
                  Reset all
                </Button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
