import { cn } from './utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-primary/25 animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  )
}

const avatarSizeMap = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-16',
} as const

function SkeletonAvatar({
  size = 'md',
  className,
}: {
  size?: keyof typeof avatarSizeMap
  className?: string
}) {
  return <Skeleton className={cn('rounded-full shrink-0', avatarSizeMap[size], className)} />
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4 rounded-xl border p-6', className)}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  )
}

function SkeletonBlock({ height = 'h-24', className }: { height?: string; className?: string }) {
  return <Skeleton className={cn('w-full rounded-md', height, className)} />
}

export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonBlock }
