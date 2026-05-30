import type { ComponentType } from 'react'
import type { ShowcaseCard, TemplateId } from '../model/document'
import type { CardTheme } from '../model/theme'
import type { LayoutId } from '../model/theme'
import type { StyleVariant, VariantStyle } from './variants'

export interface RenderContext {
  readonly card: ShowcaseCard
  readonly theme: CardTheme
  readonly variant: VariantStyle
}

export type LayoutProps = RenderContext

export interface TemplateMeta {
  readonly id: TemplateId
  readonly name: string
  readonly layout: LayoutId
  readonly variant: StyleVariant
  readonly defaultTheme: CardTheme
  readonly Layout: ComponentType<LayoutProps>
}

export type { ShowcaseCard, CardTheme, VariantStyle }
