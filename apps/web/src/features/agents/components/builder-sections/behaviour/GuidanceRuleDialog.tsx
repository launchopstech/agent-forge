'use client'

import React, { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Label } from '@forge/ui/src/label'
import { Input } from '@forge/ui/src/input'
import { Textarea } from '@forge/ui/src/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { Switch } from '@forge/ui/src/switch'
import { Button } from '@forge/ui/src/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@forge/ui/src/dialog'
import type { GuidanceRule, GuidanceCategory } from '../../../types'

interface GuidanceRuleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  rule?: GuidanceRule
  onSave: (data: Omit<GuidanceRule, 'id' | 'createdAt' | 'updatedAt'>) => void
}

interface GuidanceRuleFormProps {
  rule?: GuidanceRule
  onSave: (data: Omit<GuidanceRule, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

const GuidanceRuleForm = React.memo(function GuidanceRuleForm({
  rule,
  onSave,
  onCancel,
}: GuidanceRuleFormProps) {
  const t = useTranslations('agentHub.builder.behaviour')

  const [name, setName] = useState(rule?.name ?? '')
  const [category, setCategory] = useState<GuidanceCategory>(rule?.category ?? 'communication')
  const [whenCondition, setWhenCondition] = useState(rule?.whenCondition ?? '')
  const [instructions, setInstructions] = useState(rule?.instructions ?? '')
  const [enabled, setEnabled] = useState(rule?.enabled ?? true)

  const handleSave = useCallback(() => {
    if (!name.trim() || !whenCondition.trim() || !instructions.trim()) return
    onSave({
      name: name.trim(),
      category,
      whenCondition: whenCondition.trim(),
      instructions: instructions.trim(),
      enabled,
    })
  }, [name, category, whenCondition, instructions, enabled, onSave])

  const isValid = name.trim() && whenCondition.trim() && instructions.trim()

  return (
    <>
      <DialogHeader>
        <DialogTitle>{rule ? t('editRule') : t('addRule')}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="rule-name">{t('ruleNameLabel')}</Label>
          <Input
            id="rule-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('ruleNamePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-category">{t('ruleCategoryLabel')}</Label>
          <Select value={category} onValueChange={(val) => setCategory(val as GuidanceCategory)}>
            <SelectTrigger id="rule-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="communication">{t('categoryCommunication')}</SelectItem>
              <SelectItem value="escalation">{t('categoryEscalation')}</SelectItem>
              <SelectItem value="other">{t('categoryOther')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-when">{t('ruleWhenLabel')}</Label>
          <Textarea
            id="rule-when"
            value={whenCondition}
            onChange={(e) => setWhenCondition(e.target.value)}
            placeholder={t('ruleWhenPlaceholder')}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-instructions">{t('ruleInstructionsLabel')}</Label>
          <Textarea
            id="rule-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={t('ruleInstructionsPlaceholder')}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="rule-enabled">{t('ruleEnabledLabel')}</Label>
          <Switch id="rule-enabled" checked={enabled} onCheckedChange={setEnabled} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSave} disabled={!isValid}>
          {t('save')}
        </Button>
      </DialogFooter>
    </>
  )
})

export const GuidanceRuleDialog = React.memo(function GuidanceRuleDialog({
  open,
  onOpenChange,
  rule,
  onSave,
}: GuidanceRuleDialogProps) {
  const handleSave = useCallback(
    (data: Omit<GuidanceRule, 'id' | 'createdAt' | 'updatedAt'>) => {
      onSave(data)
      onOpenChange(false)
    },
    [onSave, onOpenChange]
  )

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && <GuidanceRuleForm rule={rule} onSave={handleSave} onCancel={handleCancel} />}
      </DialogContent>
    </Dialog>
  )
})
