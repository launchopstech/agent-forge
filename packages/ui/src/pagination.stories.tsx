import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { useTranslations } from 'next-intl'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from './pagination'

const meta: Meta = {
  title: 'UI/Pagination',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj

function LocalizedPagination() {
  const t = useTranslations('ui')
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" label={t('previous')} ariaLabel={t('goToPreviousPage')} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" label={t('next')} ariaLabel={t('goToNextPage')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export const Default: Story = {
  render: () => <LocalizedPagination />,
}

function LocalizedWithEllipsis() {
  const t = useTranslations('ui')
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" label={t('previous')} ariaLabel={t('goToPreviousPage')} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis morePagesLabel={t('morePages')} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            5
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis morePagesLabel={t('morePages')} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">10</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" label={t('next')} ariaLabel={t('goToNextPage')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export const WithEllipsis: Story = {
  render: () => <LocalizedWithEllipsis />,
}

function LocalizedFirstPage() {
  const t = useTranslations('ui')
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled="true"
            label={t('previous')}
            ariaLabel={t('goToPreviousPage')}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" label={t('next')} ariaLabel={t('goToNextPage')} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export const FirstPage: Story = {
  render: () => <LocalizedFirstPage />,
}
