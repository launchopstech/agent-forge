import { addons, types } from '@storybook/manager-api'
import React from 'react'
import { ThemeEditorPanel } from './addons/ThemeEditorPanel'

addons.register('forge/theme-editor', () => {
  addons.add('forge/theme-editor/panel', {
    type: types.PANEL,
    title: '🎨 Theme',
    render: ({ active }: { active?: boolean }) =>
      React.createElement(ThemeEditorPanel, { active: active ?? false }),
  })
})
