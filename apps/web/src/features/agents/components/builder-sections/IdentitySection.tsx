'use client'

import { useTranslations } from 'next-intl'
import { Input } from '@forge/ui/src/input'
import { Label } from '@forge/ui/src/label'
import { Textarea } from '@forge/ui/src/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@forge/ui/src/select'
import { useAgentBuilderStore } from '../../store/agent-builder.store'

export function IdentitySection() {
  const t = useTranslations('agentHub.builder.identity')
  const { draftAgent, updateIdentity } = useAgentBuilderStore()
  const { identity } = draftAgent

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t('title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('subtitle')}</p>
      </div>

      <div className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="agent-name">{t('nameLabel')}</Label>
          <Input
            id="agent-name"
            value={identity.name}
            onChange={(e) => updateIdentity({ name: e.target.value })}
            placeholder={t('namePlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="welcome-message">{t('welcomeMessageLabel')}</Label>
          <Textarea
            id="welcome-message"
            value={identity.welcomeMessage}
            onChange={(e) => updateIdentity({ welcomeMessage: e.target.value })}
            placeholder={t('welcomeMessagePlaceholder')}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">{t('toneLabel')}</Label>
          <Select
            value={identity.tone}
            onValueChange={(val) => updateIdentity({ tone: val as typeof identity.tone })}
          >
            <SelectTrigger id="tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">{t('toneProfessional')}</SelectItem>
              <SelectItem value="friendly">{t('toneFriendly')}</SelectItem>
              <SelectItem value="formal">{t('toneFormal')}</SelectItem>
              <SelectItem value="casual">{t('toneCasual')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">{t('languageLabel')}</Label>
          <Select
            value={identity.language}
            onValueChange={(val) => updateIdentity({ language: val })}
          >
            <SelectTrigger id="language">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en-US">{t('langEnUS')}</SelectItem>
              <SelectItem value="en-GB">{t('langEnGB')}</SelectItem>
              <SelectItem value="fr-FR">{t('langFrFR')}</SelectItem>
              <SelectItem value="es-ES">{t('langEsES')}</SelectItem>
              <SelectItem value="de-DE">{t('langDeDe')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
