'use client'

import React, { useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MoreHorizontal } from 'lucide-react'
import { DataTable, type ColumnDef } from '@forge/ui/src/data-table'
import { Badge } from '@forge/ui/src/badge'
import { Button } from '@forge/ui/src/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@forge/ui/src/dropdown-menu'
import type { Agent, AgentStatus } from '../types'
import { AgentTablePagination } from './AgentTablePagination'

interface AgentTableProps {
  agents: Agent[]
  onDelete?: (id: string) => Promise<void> | void
  title?: string
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
}

function statusVariant(status: AgentStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'live':
      return 'default'
    case 'draft':
      return 'secondary'
    case 'paused':
      return 'destructive'
  }
}

// ─── Actions cell (extracted to avoid hook rules in column def) ──────────────

function ActionsCell({
  agent,
  onDelete,
}: {
  agent: Agent
  onDelete?: (id: string) => Promise<void> | void
}) {
  const t = useTranslations('agentHub.dashboard')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="size-4" />
          <span className="sr-only">{t('actions')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/agents/${agent.id}/identity`}>{t('edit')}</Link>
        </DropdownMenuItem>
        {onDelete && (
          <DropdownMenuItem className="text-destructive" onClick={() => void onDelete(agent.id)}>
            {t('delete')}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── Mobile card ─────────────────────────────────────────────────────────────

function AgentMobileCard({
  agent,
  onDelete,
}: {
  agent: Agent
  onDelete?: (id: string) => Promise<void> | void
}) {
  const t = useTranslations('agentHub.dashboard')
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-[56px]">
      <Link href={`/agents/${agent.id}/identity`} className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate">{agent.name}</span>
          <Badge variant={statusVariant(agent.status)} className="text-[10px] shrink-0">
            {agent.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {agent.channels.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {agent.channels.map((ch) => (
                <Badge key={ch} variant="secondary" className="text-[10px] h-4 px-1">
                  {ch}
                </Badge>
              ))}
            </div>
          ) : null}
          <span className="text-xs text-muted-foreground">
            {agent.conversations.toLocaleString()} {t('conversations').toLowerCase()}
          </span>
        </div>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">{t('actions')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/agents/${agent.id}/identity`}>{t('edit')}</Link>
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem className="text-destructive" onClick={() => void onDelete(agent.id)}>
              {t('delete')}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

// ─── Column definitions hook ─────────────────────────────────────────────────

function useAgentColumns(
  onDelete?: (id: string) => Promise<void> | void
): ColumnDef<Agent, unknown>[] {
  const t = useTranslations('agentHub.dashboard')

  return useMemo(
    (): ColumnDef<Agent, unknown>[] => [
      {
        accessorKey: 'name',
        header: () => t('agentName'),
        cell: ({ row }) => (
          <span className="font-medium">
            <Link href={`/agents/${row.original.id}/identity`} className="hover:underline">
              {row.original.name}
            </Link>
          </span>
        ),
      },
      {
        accessorKey: 'channels',
        header: () => t('channels'),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.channels.length > 0 ? (
              row.original.channels.map((ch) => (
                <Badge key={ch} variant="secondary" className="text-xs">
                  {ch}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">&mdash;</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'conversations',
        header: () => <span className="text-right block">{t('conversations')}</span>,
        cell: ({ row }) => (
          <span className="text-right block">{row.original.conversations.toLocaleString()}</span>
        ),
      },
      {
        accessorKey: 'resolution',
        header: () => <span className="text-right block">{t('resolution')}</span>,
        cell: ({ row }) => (
          <span className="text-right block">
            {row.original.resolution !== null ? `${row.original.resolution}%` : '\u2014'}
          </span>
        ),
      },
      {
        accessorKey: 'csat',
        header: () => <span className="text-right block">{t('csat')}</span>,
        cell: ({ row }) => (
          <span className="text-right block">
            {row.original.csat !== null ? row.original.csat.toFixed(1) : '\u2014'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: () => t('status'),
        cell: ({ row }) => (
          <Badge variant={statusVariant(row.original.status)}>{row.original.status}</Badge>
        ),
      },
      {
        id: 'actions',
        header: () => null,
        cell: ({ row }) => <ActionsCell agent={row.original} onDelete={onDelete} />,
        meta: { className: 'w-10' },
      },
    ],
    [t, onDelete]
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export function AgentTable({
  agents,
  onDelete,
  title,
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
}: AgentTableProps) {
  const columns = useAgentColumns(onDelete)

  const renderMobileCard = useCallback(
    (agent: Agent) => <AgentMobileCard agent={agent} onDelete={onDelete} />,
    [onDelete]
  )

  return (
    <DataTable
      columns={columns}
      data={agents}
      header={
        title ? (
          <div className="px-3 pt-4 pb-2">
            <span className="text-base font-semibold text-foreground">{title}</span>
          </div>
        ) : undefined
      }
      footer={
        onPageChange ? (
          <AgentTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={onPageChange}
          />
        ) : undefined
      }
      mobileCard={renderMobileCard}
    />
  )
}
