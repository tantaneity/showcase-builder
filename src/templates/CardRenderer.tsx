import type { ShowcaseCard, TemplateId } from '../model/document'
import type { CardTheme } from '../model/theme'
import { getTemplate } from './registry'
import { VARIANTS } from './variants'

interface CardRendererProps {
  readonly templateId: TemplateId
  readonly card: ShowcaseCard
  readonly theme: CardTheme
}

export const CardRenderer = ({ templateId, card, theme }: CardRendererProps) => {
  const template = getTemplate(templateId)
  const variant = VARIANTS[template.variant]
  const { Layout } = template
  return <Layout card={card} theme={theme} variant={variant} />
}
