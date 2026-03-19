import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ThemeEditor } from './ThemeEditor'
import { DEFAULT_LIGHT_VARS, DEFAULT_DARK_VARS } from './constants'

const meta: Meta<typeof ThemeEditor> = {
  title: 'UI/ThemeEditor',
  component: ThemeEditor,
  parameters: {
    layout: 'padded',
    noLayoutWrapper: true,
  },
}

export default meta
type Story = StoryObj<typeof ThemeEditor>

function ThemeEditorWrapper(
  props: Omit<React.ComponentProps<typeof ThemeEditor>, 'lightVars' | 'darkVars' | 'onChange'>
) {
  const [lightVars, setLightVars] = useState(DEFAULT_LIGHT_VARS)
  const [darkVars, setDarkVars] = useState(DEFAULT_DARK_VARS)

  const handleChange = (vars: Record<string, string>, mode: 'light' | 'dark') => {
    if (mode === 'light') setLightVars(vars)
    else setDarkVars(vars)
  }

  return (
    <ThemeEditor {...props} lightVars={lightVars} darkVars={darkVars} onChange={handleChange} />
  )
}

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <ThemeEditorWrapper
        mode="light"
        onReset={() => {}}
        onExport={() => {
          void navigator.clipboard.writeText('/* CSS export */')
        }}
      />
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div className="max-w-xl">
      <ThemeEditorWrapper
        mode="dark"
        onReset={() => {}}
        onExport={() => {
          void navigator.clipboard.writeText('/* CSS export */')
        }}
      />
    </div>
  ),
  parameters: {
    themes: { themeOverride: 'dark' },
  },
}

export const ReadOnly: Story = {
  render: () => (
    <div className="max-w-xl">
      <ThemeEditorWrapper mode="light" readOnly onReset={() => {}} onExport={() => {}} />
    </div>
  ),
}

export const WithSave: Story = {
  render: () => (
    <div className="max-w-xl">
      <ThemeEditorWrapper
        mode="light"
        onReset={() => {}}
        onExport={() => {
          void navigator.clipboard.writeText('/* CSS export */')
        }}
        onSave={() => {}}
      />
    </div>
  ),
}
