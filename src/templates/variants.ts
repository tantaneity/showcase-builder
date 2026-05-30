export type StyleVariant = 'editorial' | 'soft' | 'brutalist' | 'mono'

export interface VariantStyle {
  readonly cardRadius: number
  readonly mockupRadius: number
  readonly chipRadius: number
  readonly chipBorderWidth: number
  readonly titleWeight: number
  readonly titleLetterSpacing: string
  readonly titleSize: number
  readonly uppercaseTitle: boolean
  readonly showBrowserChrome: boolean
  readonly frameBorderWidth: number
}

export const VARIANTS: Record<StyleVariant, VariantStyle> = {
  editorial: {
    cardRadius: 0,
    mockupRadius: 16,
    chipRadius: 999,
    chipBorderWidth: 1,
    titleWeight: 700,
    titleLetterSpacing: '-0.02em',
    titleSize: 52,
    uppercaseTitle: false,
    showBrowserChrome: true,
    frameBorderWidth: 0,
  },
  soft: {
    cardRadius: 0,
    mockupRadius: 22,
    chipRadius: 999,
    chipBorderWidth: 1,
    titleWeight: 600,
    titleLetterSpacing: '-0.025em',
    titleSize: 50,
    uppercaseTitle: false,
    showBrowserChrome: true,
    frameBorderWidth: 0,
  },
  brutalist: {
    cardRadius: 0,
    mockupRadius: 0,
    chipRadius: 0,
    chipBorderWidth: 2,
    titleWeight: 800,
    titleLetterSpacing: '-0.01em',
    titleSize: 56,
    uppercaseTitle: true,
    showBrowserChrome: false,
    frameBorderWidth: 3,
  },
  mono: {
    cardRadius: 0,
    mockupRadius: 8,
    chipRadius: 4,
    chipBorderWidth: 1,
    titleWeight: 600,
    titleLetterSpacing: '-0.01em',
    titleSize: 44,
    uppercaseTitle: false,
    showBrowserChrome: true,
    frameBorderWidth: 1,
  },
}
