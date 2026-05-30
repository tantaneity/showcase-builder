import { MOCKUP_FRAMES } from '../constants'

export type TemplateId = 'dark-editorial'

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
  readonly screenshot: ScreenshotSlot | null
}

export interface ShowcaseDocument {
  readonly version: number
  readonly templateId: TemplateId
  readonly cards: readonly ShowcaseCard[]
}

export type CardContentPatch = Partial<
  Pick<ShowcaseCard, 'title' | 'description' | 'stack' | 'mockupFrame'>
>
