import React from 'react'
import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface ResponsiveImageProps extends Omit<ImageProps, 'alt'> {
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}

/**
 * Thin wrapper around next/image that enforces:
 * - Explicit alt text (required, not optional)
 * - Sensible default `sizes` to avoid layout shifts
 * - `object-cover` by default (override via className)
 *
 * Always use this instead of <img> or bare next/image.
 */
export function ResponsiveImage({
  alt,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  ...props
}: ResponsiveImageProps) {
  return (
    <Image
      alt={alt}
      priority={priority}
      sizes={sizes}
      className={cn('object-cover', className)}
      {...props}
    />
  )
}
