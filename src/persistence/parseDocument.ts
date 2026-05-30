import { MOCKUP_FRAMES } from '../constants'
import type {
  MockupFrame,
  ScreenshotAdjust,
  ScreenshotSlot,
  ShowcaseCard,
  ShowcaseDocument,
  TemplateId,
} from '../model/document'
import { DEFAULT_SCREENSHOT_ADJUST } from '../model/defaults'
import type {
  BackgroundKind,
  CardTheme,
  FontFamilyId,
  MockupSide,
} from '../model/theme'
import { FONT_FAMILIES } from '../model/theme'
import { getDefaultTheme } from '../templates/registry'

const SUPPORTED_TEMPLATE_IDS: readonly TemplateId[] = [
  'dark-editorial',
  'light-clean',
  'brutalist',
  'gradient-glow',
  'minimal-mono',
  'spotlight',
]

const BACKGROUND_KINDS: readonly BackgroundKind[] = ['solid', 'gradient']
const MOCKUP_SIDES: readonly MockupSide[] = ['left', 'right']

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

const pickString = (value: unknown, fallback: string): string =>
  typeof value === 'string' ? value : fallback

const pickNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

const pickBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback

const pickFont = (value: unknown, fallback: FontFamilyId): FontFamilyId =>
  typeof value === 'string' && value in FONT_FAMILIES ? (value as FontFamilyId) : fallback

const pickFromList = <T extends string>(value: unknown, list: readonly T[], fallback: T): T =>
  typeof value === 'string' && (list as readonly string[]).includes(value) ? (value as T) : fallback

const parseTheme = (value: unknown, templateId: TemplateId): CardTheme => {
  const fallback = getDefaultTheme(templateId)
  if (!isRecord(value)) {
    return fallback
  }
  return {
    backgroundKind: pickFromList(value.backgroundKind, BACKGROUND_KINDS, fallback.backgroundKind),
    backgroundFrom: pickString(value.backgroundFrom, fallback.backgroundFrom),
    backgroundTo: pickString(value.backgroundTo, fallback.backgroundTo),
    backgroundAngle: pickNumber(value.backgroundAngle, fallback.backgroundAngle),
    accent: pickString(value.accent, fallback.accent),
    textPrimary: pickString(value.textPrimary, fallback.textPrimary),
    textSecondary: pickString(value.textSecondary, fallback.textSecondary),
    fontFamily: pickFont(value.fontFamily, fallback.fontFamily),
    mockupTilt: pickNumber(value.mockupTilt, fallback.mockupTilt),
    mockupShadow: pickBoolean(value.mockupShadow, fallback.mockupShadow),
    mockupSide: pickFromList(value.mockupSide, MOCKUP_SIDES, fallback.mockupSide),
    paddingScale: pickNumber(value.paddingScale, fallback.paddingScale),
    showGlow: pickBoolean(value.showGlow, fallback.showGlow),
  }
}

const parseAdjust = (value: unknown): ScreenshotAdjust => {
  if (!isRecord(value)) {
    return DEFAULT_SCREENSHOT_ADJUST
  }
  return {
    scale: pickNumber(value.scale, DEFAULT_SCREENSHOT_ADJUST.scale),
    offsetX: pickNumber(value.offsetX, DEFAULT_SCREENSHOT_ADJUST.offsetX),
    offsetY: pickNumber(value.offsetY, DEFAULT_SCREENSHOT_ADJUST.offsetY),
  }
}

const parseScreenshot = (value: unknown): ScreenshotSlot => {
  if (!isRecord(value) || typeof value.dataUrl !== 'string' || typeof value.fileName !== 'string') {
    throw new DocumentParseError('Invalid screenshot slot')
  }
  return { dataUrl: value.dataUrl, fileName: value.fileName, adjust: parseAdjust(value.adjust) }
}

const parseScreenshots = (card: Record<string, unknown>): readonly ScreenshotSlot[] => {
  if (Array.isArray(card.screenshots)) {
    return card.screenshots.map(parseScreenshot)
  }
  if (card.screenshot !== null && card.screenshot !== undefined) {
    return [parseScreenshot(card.screenshot)]
  }
  return []
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
    screenshots: parseScreenshots(value),
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
    theme: parseTheme(raw.theme, raw.templateId),
    cards: raw.cards.map(parseCard),
  }
}
