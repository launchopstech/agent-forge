'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { MoreHorizontal } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@forge/ui/src/table'
import { Badge } from '@forge/ui/src/badge'
import { Button } from '@forge/ui/src/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@forge/ui/src/dropdown-menu'
import type { Agent, AgentStatus } from '../types'

interface AgentTableProps {
  agents: Agent[]
  onDelete?: (id: string) => Promise<void> | void
  title?: string
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

export function AgentTable({ agents, onDelete, title }: AgentTableProps) {
  const t = useTranslations('agentHub.dashboard')

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          {title && (
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead colSpan={7} className="px-3 pt-4 pb-2">
                <span className="text-base font-semibold text-foreground">{title}</span>
              </TableHead>
            </TableRow>
          )}
          <TableRow>
            <TableHead className="px-3">{t('agentName')}</TableHead>
            <TableHead className="px-3">{t('channels')}</TableHead>
            <TableHead className="px-3 text-right">{t('conversations')}</TableHead>
            <TableHead className="px-3 text-right">{t('resolution')}</TableHead>
            <TableHead className="px-3 text-right">{t('csat')}</TableHead>
            <TableHead className="px-3">{t('status')}</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id} className="hover:bg-muted/50 cursor-pointer transition-colors">
              <TableCell className="px-3 py-2.5 text-sm font-medium">
                <Link href={`/agents/${agent.id}/identity`} className="hover:underline">
                  {agent.name}
                </Link>
              </TableCell>
              <TableCell className="px-3 py-2.5 text-sm">
                <div className="flex flex-wrap gap-1">
                  {agent.channels.length > 0 ? (
                    agent.channels.map((ch) => (
                      <Badge key={ch} variant="secondary" className="text-xs">
                        {ch}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-3 py-2.5 text-sm text-right">
                {agent.conversations.toLocaleString()}
              </TableCell>
              <TableCell className="px-3 py-2.5 text-sm text-right">
                {agent.resolution !== null ? `${agent.resolution}%` : '—'}
              </TableCell>
              <TableCell className="px-3 py-2.5 text-sm text-right">
                {agent.csat !== null ? agent.csat.toFixed(1) : '—'}
              </TableCell>
              <TableCell className="px-3 py-2.5 text-sm">
                <Badge variant={statusVariant(agent.status)}>{agent.status}</Badge>
              </TableCell>
              <TableCell className="py-2.5">
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
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => void onDelete(agent.id)}
                      >
                        {t('delete')}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
