export type BackgroundKind = 'solid' | 'gradient'

export type LayoutId = 'split' | 'stacked' | 'spotlight'

export type MockupSide = 'left' | 'right'

export type FontFamilyId = 'inter' | 'system' | 'grotesk' | 'serif' | 'mono'

export interface CardTheme {
  readonly backgroundKind: BackgroundKind
  readonly backgroundFrom: string
  readonly backgroundTo: string
  readonly backgroundAngle: number
  readonly accent: string
  readonly textPrimary: string
  readonly textSecondary: string
  readonly fontFamily: FontFamilyId
  readonly mockupTilt: number
  readonly mockupShadow: boolean
  readonly mockupSide: MockupSide
  readonly paddingScale: number
  readonly showGlow: boolean
}

export type CardThemePatch = Partial<CardTheme>

export const FONT_FAMILIES: Record<FontFamilyId, { readonly name: string; readonly stack: string }> = {
  inter: { name: 'Inter', stack: "'Inter', system-ui, sans-serif" },
  system: { name: 'System', stack: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
  grotesk: { name: 'Grotesk', stack: "'Space Grotesk', 'Inter', system-ui, sans-serif" },
  serif: { name: 'Serif', stack: "Georgia, 'Times New Roman', serif" },
  mono: { name: 'Mono', stack: "'JetBrains Mono', ui-monospace, Consolas, monospace" },
}

export interface BackgroundPreset {
  readonly id: string
  readonly name: string
  readonly kind: BackgroundKind
  readonly from: string
  readonly to: string
  readonly angle: number
}

export const BACKGROUND_PRESETS: readonly BackgroundPreset[] = [
  { id: 'midnight', name: 'Midnight', kind: 'gradient', from: '#0d0f14', to: '#16191f', angle: 160 },
  { id: 'indigo', name: 'Indigo', kind: 'gradient', from: '#1e1b4b', to: '#0f172a', angle: 150 },
  { id: 'plum', name: 'Plum', kind: 'gradient', from: '#2d1b3d', to: '#11091a', angle: 155 },
  { id: 'ember', name: 'Ember', kind: 'gradient', from: '#2b1410', to: '#120808', angle: 150 },
  { id: 'teal', name: 'Teal', kind: 'gradient', from: '#042f2e', to: '#0a0f14', angle: 150 },
  { id: 'paper', name: 'Paper', kind: 'gradient', from: '#f7f7f5', to: '#e8e8e3', angle: 160 },
  { id: 'snow', name: 'Snow', kind: 'solid', from: '#ffffff', to: '#ffffff', angle: 0 },
  { id: 'ink', name: 'Ink', kind: 'solid', from: '#0b0b0c', to: '#0b0b0c', angle: 0 },
]

export const MIN_MOCKUP_TILT = -28
export const MAX_MOCKUP_TILT = 28
export const MIN_PADDING_SCALE = 0.7
export const MAX_PADDING_SCALE = 1.6

export const resolveFontStack = (fontFamily: FontFamilyId): string =>
  FONT_FAMILIES[fontFamily].stack

export const resolveBackground = (theme: CardTheme): string => {
  if (theme.backgroundKind === 'solid') {
    return theme.backgroundFrom
  }
  return `linear-gradient(${theme.backgroundAngle}deg, ${theme.backgroundFrom}, ${theme.backgroundTo})`
}
