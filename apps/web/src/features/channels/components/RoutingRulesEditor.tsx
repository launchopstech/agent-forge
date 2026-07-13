'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@forge/ui/src/button'
import { Input } from '@forge/ui/src/input'
import { Label } from '@forge/ui/src/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { Skeleton } from '@forge/ui/src/skeleton'
import { Textarea } from '@forge/ui/src/textarea'
import { Card, CardContent } from '@forge/ui/src/card'
import { toast } from '@/hooks/use-toast'
import {
  fetchRoutingRules as _fetchRoutingRules,
  createRoutingRule as _createRoutingRule,
  deleteRoutingRule as _deleteRoutingRule,
} from '../api/channels.api'
import type { RoutingRule, CreateRoutingRulePayload, KeywordConditionValue } from '../types'

interface Agent {
  id: string
  name: string
}

interface RoutingRulesEditorProps {
  channelId: string
  /** Available agents to route to */
  agents: Agent[]
  fetchRoutingRules?: typeof _fetchRoutingRules
  createRoutingRule?: typeof _createRoutingRule
  deleteRoutingRule?: typeof _deleteRoutingRule
}

/** Parse a comma-separated keyword string into a string[] for the API. */
function parseKeywords(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Display keywords[] as a human-readable comma-separated string. */
function displayKeywords(conditionValue: unknown): string {
  const cv = conditionValue as KeywordConditionValue | undefined
  if (!cv?.keywords || cv.keywords.length === 0) return ''
  return cv.keywords.join(', ')
}

export function RoutingRulesEditor({
  channelId,
  agents,
  fetchRoutingRules = _fetchRoutingRules,
  createRoutingRule = _createRoutingRule,
  deleteRoutingRule = _deleteRoutingRule,
}: RoutingRulesEditorProps) {
  const [rules, setRules] = useState<RoutingRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')
  const [newRule, setNewRule] = useState<Partial<CreateRoutingRulePayload>>({
    conditionType: 'always',
    agentId: agents[0]?.id ?? '',
  })

  const load = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchRoutingRules(channelId)
      setRules(data)
    } catch {
      toast({ title: 'Failed to load routing rules', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }, [channelId])

  useEffect(() => {
    void load()
  }, [load])

  const handleAdd = async () => {
    if (!newRule.agentId || !newRule.conditionType) return
    setIsAdding(true)
    try {
      const payload: CreateRoutingRulePayload = {
        conditionType: newRule.conditionType,
        conditionValue:
          newRule.conditionType === 'keyword' ? { keywords: parseKeywords(keywordInput) } : {},
        agentId: newRule.agentId,
        agentInstructions: newRule.agentInstructions,
      }
      const rule = await createRoutingRule(channelId, payload)
      setRules((prev) => [...prev, rule])
      setNewRule({ conditionType: 'always', agentId: agents[0]?.id ?? '' })
      setKeywordInput('')
      toast({ title: 'Routing rule added' })
    } catch {
      toast({ title: 'Failed to add routing rule', variant: 'destructive' })
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (ruleId: string) => {
    try {
      await deleteRoutingRule(channelId, ruleId)
      setRules((prev) => prev.filter((r) => r.id !== ruleId))
      toast({ title: 'Routing rule removed' })
    } catch {
      toast({ title: 'Failed to remove routing rule', variant: 'destructive' })
    }
  }

  const agentName = (id: string) => agents.find((a) => a.id === id)?.name ?? id.slice(0, 8)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Routing Rules</h3>
        <span className="text-xs text-muted-foreground">First match wins, ordered by priority</span>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      ) : rules.length === 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          No routing rules yet. Add one below to route messages to an agent.
        </div>
      ) : (
        <div className="space-y-2">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardContent className="flex items-start justify-between px-4 py-3 text-sm">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono">
                      p{rule.priority}
                    </span>
                    <span className="text-muted-foreground">
                      {rule.conditionType === 'always'
                        ? 'Always'
                        : `Keywords: ${displayKeywords(rule.conditionValue)}`}
                    </span>
                    <span>→</span>
                    <span className="font-medium">{agentName(rule.agentId)}</span>
                  </div>
                  {rule.agentInstructions && (
                    <p className="mt-1 text-xs text-muted-foreground italic pl-1">
                      {rule.agentInstructions}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => void handleDelete(rule.id)}
                  className="ml-3 rounded-md p-1 text-muted-foreground hover:text-destructive"
                  aria-label="Delete rule"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add rule form */}
      <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Add rule
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Condition</Label>
            <Select
              value={newRule.conditionType}
              onValueChange={(v) => setNewRule((r) => ({ ...r, conditionType: v }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always">Always (catch-all)</SelectItem>
                <SelectItem value="keyword">Keyword match</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Route to Agent</Label>
            <Select
              value={newRule.agentId}
              onValueChange={(v) => setNewRule((r) => ({ ...r, agentId: v }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select agent…" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {newRule.conditionType === 'keyword' && (
          <div className="space-y-1">
            <Label className="text-xs">Keywords (comma-separated)</Label>
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="e.g. billing, payment, invoice"
              className="h-8 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Any message containing one of these keywords will match.
            </p>
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-xs">Agent Instructions (optional)</Label>
          <Textarea
            value={newRule.agentInstructions ?? ''}
            onChange={(e) => setNewRule((r) => ({ ...r, agentInstructions: e.target.value }))}
            placeholder="Extra instructions specific to this channel rule…"
            rows={2}
            className="text-xs resize-none"
          />
        </div>

        <Button
          size="sm"
          className="gap-1.5 text-xs"
          disabled={isAdding || !newRule.agentId}
          onClick={handleAdd}
        >
          <Plus className="h-3.5 w-3.5" />
          {isAdding ? 'Adding…' : 'Add rule'}
        </Button>
      </div>
    </div>
  )
}
