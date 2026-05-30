import { MOCKUP_FRAMES } from '../constants'
import type { CardTheme } from './theme'

export type TemplateId =
  | 'dark-editorial'
  | 'light-clean'
  | 'brutalist'
  | 'gradient-glow'
  | 'minimal-mono'
  | 'spotlight'

export type MockupFrame = (typeof MOCKUP_FRAMES)[number]

export interface ScreenshotSlot {
  readonly dataUrl: string
  readonly fileName: string
}

export interface ShowcaseCard {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly stack: readonly string[]
  readonly mockupFrame: MockupFrame
  readonly screenshots: readonly ScreenshotSlot[]
}

export interface ShowcaseDocument {
  readonly version: number
  readonly templateId: TemplateId
  readonly theme: CardTheme
  readonly cards: readonly ShowcaseCard[]
}

export type CardContentPatch = Partial<
  Pick<ShowcaseCard, 'title' | 'description' | 'stack' | 'mockupFrame'>
>
