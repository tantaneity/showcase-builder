import { DOCUMENT_VERSION } from '../constants'
import type { ShowcaseCard, ShowcaseDocument, TemplateId } from './document'

const DEFAULT_TEMPLATE_ID: TemplateId = 'dark-editorial'

const DEFAULT_CARD_TITLE = 'Untitled feature'
const DEFAULT_CARD_DESCRIPTION = 'Describe what this part of the project does and why it matters.'

export const createCardId = (): string => crypto.randomUUID()

export const createEmptyCard = (): ShowcaseCard => ({
  id: createCardId(),
  title: DEFAULT_CARD_TITLE,
  description: DEFAULT_CARD_DESCRIPTION,
  stack: [],
  mockupFrame: 'browser',
  screenshot: null,
})

export const createEmptyDocument = (): ShowcaseDocument => ({
  version: DOCUMENT_VERSION,
  templateId: DEFAULT_TEMPLATE_ID,
  cards: [createEmptyCard()],
})
