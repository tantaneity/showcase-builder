import { PROJECT_FILE_EXTENSION, PROJECT_FILE_MIME } from '../constants'
import type { ShowcaseDocument } from '../model/document'
import { downloadUrl } from '../utils/download'
import { DocumentParseError, parseDocument } from './parseDocument'

const JSON_INDENT = 2

export const downloadDocument = (document: ShowcaseDocument, fileSlug: string): void => {
  const json = JSON.stringify(document, null, JSON_INDENT)
  const blob = new Blob([json], { type: PROJECT_FILE_MIME })
  const url = URL.createObjectURL(blob)
  try {
    downloadUrl(url, `${fileSlug}.${PROJECT_FILE_EXTENSION}`)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const readDocumentFromFile = async (file: File): Promise<ShowcaseDocument> => {
  const text = await file.text()
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch (error) {
    throw new DocumentParseError(
      `Invalid JSON: ${error instanceof Error ? error.message : 'unknown error'}`,
    )
  }
  return parseDocument(parsed)
}
