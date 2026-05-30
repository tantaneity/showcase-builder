import type { ComponentType } from 'react'
import type { TemplateId } from '../model/document'
import type { CardTheme, LayoutId } from '../model/theme'
import { SplitLayout } from './layouts/SplitLayout'
import { StackedLayout } from './layouts/StackedLayout'
import { SpotlightLayout } from './layouts/SpotlightLayout'
import type { LayoutProps, TemplateMeta } from './types'
import type { StyleVariant } from './variants'

const LAYOUTS: Record<LayoutId, ComponentType<LayoutProps>> = {
  split: SplitLayout,
  stacked: StackedLayout,
  spotlight: SpotlightLayout,
}

interface TemplatePreset {
  readonly id: TemplateId
  readonly name: string
  readonly layout: LayoutId
  readonly variant: StyleVariant
  readonly theme: CardTheme
}

const PRESETS: readonly TemplatePreset[] = [
  {
    id: 'dark-editorial',
    name: 'Dark editorial',
    layout: 'split',
    variant: 'editorial',
    theme: {
      backgroundKind: 'gradient',
      backgroundFrom: '#0d0f14',
      backgroundTo: '#16191f',
      backgroundAngle: 160,
      accent: '#6366f1',
      textPrimary: '#f4f5f7',
      textSecondary: '#9aa1ad',
      fontFamily: 'inter',
      mockupTilt: -14,
      mockupShadow: true,
      mockupSide: 'right',
      paddingScale: 1,
      showGlow: true,
    },
  },
  {
    id: 'light-clean',
    name: 'Light clean',
    layout: 'split',
    variant: 'soft',
    theme: {
      backgroundKind: 'gradient',
      backgroundFrom: '#f7f7f5',
      backgroundTo: '#e8e8e3',
      backgroundAngle: 160,
      accent: '#2563eb',
      textPrimary: '#0b0b0c',
      textSecondary: '#52525b',
      fontFamily: 'system',
      mockupTilt: -6,
      mockupShadow: true,
      mockupSide: 'right',
      paddingScale: 1,
      showGlow: false,
    },
  },
  {
    id: 'gradient-glow',
    name: 'Gradient glow',
    layout: 'split',
    variant: 'soft',
    theme: {
      backgroundKind: 'gradient',
      backgroundFrom: '#1e1b4b',
      backgroundTo: '#0f172a',
      backgroundAngle: 150,
      accent: '#a855f7',
      textPrimary: '#f5f3ff',
      textSecondary: '#c4b5fd',
      fontFamily: 'grotesk',
      mockupTilt: -16,
      mockupShadow: true,
      mockupSide: 'right',
      paddingScale: 1,
      showGlow: true,
    },
  },
  {
    id: 'brutalist',
    name: 'Brutalist',
    layout: 'stacked',
    variant: 'brutalist',
    theme: {
      backgroundKind: 'solid',
      backgroundFrom: '#0b0b0c',
      backgroundTo: '#0b0b0c',
      backgroundAngle: 0,
      accent: '#ffe600',
      textPrimary: '#ffffff',
      textSecondary: '#a3a3a3',
      fontFamily: 'mono',
      mockupTilt: 0,
      mockupShadow: false,
      mockupSide: 'left',
      paddingScale: 1.1,
      showGlow: false,
    },
  },
  {
    id: 'minimal-mono',
    name: 'Minimal mono',
    layout: 'stacked',
    variant: 'mono',
    theme: {
      backgroundKind: 'solid',
      backgroundFrom: '#ffffff',
      backgroundTo: '#ffffff',
      backgroundAngle: 0,
      accent: '#111111',
      textPrimary: '#111111',
      textSecondary: '#6b7280',
      fontFamily: 'mono',
      mockupTilt: -8,
      mockupShadow: true,
      mockupSide: 'right',
      paddingScale: 1.2,
      showGlow: false,
    },
  },
  {
    id: 'spotlight',
    name: 'Spotlight',
    layout: 'spotlight',
    variant: 'soft',
    theme: {
      backgroundKind: 'gradient',
      backgroundFrom: '#11091a',
      backgroundTo: '#2d1b3d',
      backgroundAngle: 160,
      accent: '#f43f5e',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      fontFamily: 'grotesk',
      mockupTilt: 0,
      mockupShadow: true,
      mockupSide: 'right',
      paddingScale: 1,
      showGlow: true,
    },
  },
]

const toMeta = (preset: TemplatePreset): TemplateMeta => ({
  id: preset.id,
  name: preset.name,
  layout: preset.layout,
  variant: preset.variant,
  defaultTheme: preset.theme,
  Layout: LAYOUTS[preset.layout],
})

export const TEMPLATES: Record<TemplateId, TemplateMeta> = PRESETS.reduce(
  (accumulator, preset) => {
    accumulator[preset.id] = toMeta(preset)
    return accumulator
  },
  {} as Record<TemplateId, TemplateMeta>,
)

export const TEMPLATE_LIST: readonly TemplateMeta[] = PRESETS.map(toMeta)

export const getTemplate = (id: TemplateId): TemplateMeta => TEMPLATES[id]

export const getDefaultTheme = (id: TemplateId): CardTheme => TEMPLATES[id].defaultTheme
