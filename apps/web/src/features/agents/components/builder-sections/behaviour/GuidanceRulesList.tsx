'use client'

import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@forge/ui/src/badge'
import { Button } from '@forge/ui/src/button'
import { Switch } from '@forge/ui/src/switch'
import { Label } from '@forge/ui/src/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@forge/ui/src/alert-dialog'
import { useAgentBuilderStore } from '../../../store/agent-builder.store'
import type { GuidanceRule, GuidanceCategory } from '../../../types'
import { GuidanceRuleDialog } from './GuidanceRuleDialog'

function categoryVariant(
  category: GuidanceCategory
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (category) {
    case 'communication':
      return 'secondary'
    case 'escalation':
      return 'destructive'
    case 'other':
      return 'outline'
  }
}

export const GuidanceRulesList = React.memo(function GuidanceRulesList() {
  const t = useTranslations('agentHub.builder.behaviour')
  const {
    draftAgent,
    addGuidanceRule,
    updateGuidanceRule,
    removeGuidanceRule,
    toggleGuidanceRule,
  } = useAgentBuilderStore()
  const { guidanceRules } = draftAgent.behaviour

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<GuidanceRule | undefined>(undefined)
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null)

  const categoryLabels: Record<GuidanceCategory, string> = {
    communication: t('categoryCommunication'),
    escalation: t('categoryEscalation'),
    other: t('categoryOther'),
  }

  const handleAdd = useCallback(() => {
    setEditingRule(undefined)
    setDialogOpen(true)
  }, [])

  const handleEdit = useCallback((rule: GuidanceRule) => {
    setEditingRule(rule)
    setDialogOpen(true)
  }, [])

  const handleSave = useCallback(
    (data: Omit<GuidanceRule, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (editingRule) {
        updateGuidanceRule(editingRule.id, data)
      } else {
        addGuidanceRule(data)
      }
    },
    [editingRule, addGuidanceRule, updateGuidanceRule]
  )

  const handleConfirmDelete = useCallback(() => {
    if (deleteRuleId) {
      removeGuidanceRule(deleteRuleId)
      setDeleteRuleId(null)
    }
  }, [deleteRuleId, removeGuidanceRule])

  const handleToggle = useCallback(
    (ruleId: string) => {
      toggleGuidanceRule(ruleId)
    },
    [toggleGuidanceRule]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{t('guidanceRulesLabel')}</Label>
          <p className="text-xs text-muted-foreground mt-0.5">{t('guidanceRulesHint')}</p>
        </div>
      </div>

      {guidanceRules.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">{t('noRulesTitle')}</p>
          <p className="text-xs text-muted-foreground mt-1">{t('noRulesDescription')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {guidanceRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-lg border p-3 space-y-2 hover:border-muted-foreground/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className="text-sm font-medium truncate">{rule.name}</span>
                  <Badge variant={categoryVariant(rule.category)} className="text-[10px] shrink-0">
                    {categoryLabels[rule.category]}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggle(rule.id)}
                    className="scale-75"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleEdit(rule)}
                  >
                    <Pencil className="size-3.5" />
                    <span className="sr-only">{t('editRule')}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => setDeleteRuleId(rule.id)}
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">{t('deleteRule')}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[10px] bg-amber-500/10 text-amber-700 border-amber-500/20 shrink-0"
                >
                  {t('when')}
                </Badge>
                <span className="text-xs text-muted-foreground">{rule.whenCondition}</span>
              </div>
              <div className="flex items-start gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="text-[10px] bg-green-500/10 text-green-700 border-green-500/20 shrink-0"
                >
                  {t('do')}
                </Badge>
                <span className="text-xs text-muted-foreground line-clamp-2">
                  {rule.instructions}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        className="w-full rounded-md border border-dashed py-2 text-xs text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        + {t('addRule')}
      </button>

      <GuidanceRuleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        rule={editingRule}
        onSave={handleSave}
      />

      <AlertDialog open={deleteRuleId !== null} onOpenChange={() => setDeleteRuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteRuleConfirm')}</AlertDialogTitle>
            <AlertDialogDescription>{t('deleteRuleDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>{t('deleteRule')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
})
