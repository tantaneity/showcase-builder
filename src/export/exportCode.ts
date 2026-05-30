import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ShowcaseCard, TemplateId } from '../model/document'
import type { CardTheme } from '../model/theme'
import { CardRenderer } from '../templates/CardRenderer'
import { downloadUrl } from '../utils/download'

export type CodeExportFormat = 'html' | 'react'

interface CardExportInput {
  readonly templateId: TemplateId
  readonly card: ShowcaseCard
  readonly theme: CardTheme
  readonly fileSlug: string
}

const escapeHtmlText = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const toCamelCase = (property: string): string =>
  property.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())

const cssTextToStyleObject = (cssText: string): string => {
  const entries = cssText
    .split(';')
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration.length > 0)
    .map((declaration) => {
      const separatorIndex = declaration.indexOf(':')
      const property = declaration.slice(0, separatorIndex).trim()
      const value = declaration.slice(separatorIndex + 1).trim()
      return `${toCamelCase(property)}: "${value}"`
    })
  return `{ ${entries.join(', ')} }`
}

const markupToJsx = (markup: string): string =>
  markup
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
    .replace(/style="([^"]*)"/g, (_, cssText: string) => `style={${cssTextToStyleObject(cssText)}}`)

const renderMarkup = ({ templateId, card, theme }: CardExportInput): string =>
  renderToStaticMarkup(createElement(CardRenderer, { templateId, card, theme }))

const downloadText = (text: string, fileName: string, mime: string): void => {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  try {
    downloadUrl(url, fileName)
  } finally {
    URL.revokeObjectURL(url)
  }
}

const buildHtmlDocument = (markup: string, title: string): string =>
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtmlText(title)}</title>
<style>body { margin: 0; }</style>
</head>
<body>
${markup}
</body>
</html>
`

const buildReactComponent = (jsx: string): string =>
  `export const ShowcaseCard = () => (
${jsx}
)
`

export const exportCardCode = (input: CardExportInput, format: CodeExportFormat): void => {
  const markup = renderMarkup(input)
  if (format === 'html') {
    downloadText(buildHtmlDocument(markup, input.card.title), `${input.fileSlug}.html`, 'text/html')
    return
  }
  downloadText(buildReactComponent(markupToJsx(markup)), 'ShowcaseCard.tsx', 'text/plain')
}
