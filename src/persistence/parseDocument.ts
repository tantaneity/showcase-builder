import { MOCKUP_FRAMES } from '../constants'
import type {
  MockupFrame,
  ScreenshotSlot,
  ShowcaseCard,
  ShowcaseDocument,
  TemplateId,
} from '../model/document'

const SUPPORTED_TEMPLATE_IDS: readonly TemplateId[] = ['dark-editorial']

export class DocumentParseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DocumentParseError'
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isMockupFrame = (value: unknown): value is MockupFrame =>
  typeof value === 'string' && (MOCKUP_FRAMES as readonly string[]).includes(value)

const isTemplateId = (value: unknown): value is TemplateId =>
  typeof value === 'string' && (SUPPORTED_TEMPLATE_IDS as readonly string[]).includes(value)

const parseScreenshot = (value: unknown): ScreenshotSlot | null => {
  if (value === null || value === undefined) {
    return null
  }
  if (!isRecord(value) || typeof value.dataUrl !== 'string' || typeof value.fileName !== 'string') {
    throw new DocumentParseError('Invalid screenshot slot')
  }
  return { dataUrl: value.dataUrl, fileName: value.fileName }
}

const parseStack = (value: unknown): readonly string[] => {
  if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) {
    throw new DocumentParseError('Invalid stack list')
  }
  return value
}

const parseCard = (value: unknown): ShowcaseCard => {
  if (!isRecord(value)) {
    throw new DocumentParseError('Invalid card entry')
  }
  if (
    typeof value.id !== 'string' ||
    typeof value.title !== 'string' ||
    typeof value.description !== 'string' ||
    !isMockupFrame(value.mockupFrame)
  ) {
    throw new DocumentParseError('Card is missing required fields')
  }
  return {
    id: value.id,
    title: value.title,
    description: value.description,
    stack: parseStack(value.stack),
    mockupFrame: value.mockupFrame,
    screenshot: parseScreenshot(value.screenshot),
  }
}

export const parseDocument = (raw: unknown): ShowcaseDocument => {
  if (!isRecord(raw)) {
    throw new DocumentParseError('Document root must be an object')
  }
  if (typeof raw.version !== 'number') {
    throw new DocumentParseError('Document version must be a number')
  }
  if (!isTemplateId(raw.templateId)) {
    throw new DocumentParseError('Unsupported template id')
  }
  if (!Array.isArray(raw.cards) || raw.cards.length === 0) {
    throw new DocumentParseError('Document must contain at least one card')
  }
  return {
    version: raw.version,
    templateId: raw.templateId,
    cards: raw.cards.map(parseCard),
  }
}
