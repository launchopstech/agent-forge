'use client'

import React, { useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@forge/ui/src/pagination'

interface AgentTablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

/** Build a window of page numbers: [1, '…', 4, 5, 6, '…', 10] */
function getPageRange(current: number, totalPages: number): (number | 'ellipsis')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | 'ellipsis')[] = [1]

  if (current > 3) pages.push('ellipsis')

  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < totalPages - 2) pages.push('ellipsis')

  pages.push(totalPages)
  return pages
}

export const AgentTablePagination = React.memo(function AgentTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: AgentTablePaginationProps) {
  const t = useTranslations('agentHub.dashboard')

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const pages = useMemo(() => getPageRange(page, totalPages), [page, totalPages])

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (page > 1) onPageChange(page - 1)
    },
    [page, onPageChange]
  )

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (page < totalPages) onPageChange(page + 1)
    },
    [page, totalPages, onPageChange]
  )

  const hasManyPages = totalPages > 1

  return (
    <div className="flex items-center justify-between px-3 py-3 border-t">
      {/* "Showing X–Y of Z" — always visible for context */}
      <p className="text-sm text-muted-foreground">
        <span className="hidden sm:inline">{t('showing', { from, to, total })}</span>
        <span className="sm:hidden">{t('pageOf', { page, pages: totalPages })}</span>
      </p>

      {hasManyPages && (
        <Pagination className="mx-0 w-auto justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={handlePrev}
                aria-disabled={page <= 1}
                className={page <= 1 ? 'pointer-events-none opacity-50' : undefined}
                label={t('prev')}
                ariaLabel={t('prev')}
              />
            </PaginationItem>

            {/* Page numbers — desktop only */}
            {pages.map((p, i) => (
              <PaginationItem key={i} className="hidden sm:block">
                {p === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(p)
                    }}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={handleNext}
                aria-disabled={page >= totalPages}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : undefined}
                label={t('next')}
                ariaLabel={t('next')}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
})
