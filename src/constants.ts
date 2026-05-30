export const DOCUMENT_VERSION = 1

export const STORAGE_KEY = 'showcase-builder:document'
export const PROJECT_FILE_EXTENSION = 'showcase.json'
export const PROJECT_FILE_MIME = 'application/json'

export const EXPORT_SCALES = [1, 2, 3] as const
export const DEFAULT_EXPORT_SCALE = 2
export const EXPORT_PIXEL_RATIO_BASE = 1

export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const

export const MOCKUP_FRAMES = ['browser', 'phone'] as const

export const MAX_STACK_TAGS = 8
export const MAX_TITLE_LENGTH = 80
export const MAX_DESCRIPTION_LENGTH = 280

export const CARD_EXPORT_NODE_ID = 'showcase-card-export-root'

export const CARD_WIDTH_PX = 1120
export const CARD_HEIGHT_PX = 700
