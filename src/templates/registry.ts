import type { ComponentType } from 'react'
import type { ShowcaseCard, TemplateId } from '../model/document'
import { DarkEditorial } from './DarkEditorial'

export interface CardTemplateProps {
  readonly card: ShowcaseCard
}

export interface TemplateMeta {
  readonly id: TemplateId
  readonly name: string
  readonly Component: ComponentType<CardTemplateProps>
}

export const TEMPLATES: Record<TemplateId, TemplateMeta> = {
  'dark-editorial': {
    id: 'dark-editorial',
    name: 'Dark editorial',
    Component: DarkEditorial,
  },
}

export const TEMPLATE_LIST: readonly TemplateMeta[] = Object.values(TEMPLATES)

export const getTemplate = (id: TemplateId): TemplateMeta => TEMPLATES[id]
