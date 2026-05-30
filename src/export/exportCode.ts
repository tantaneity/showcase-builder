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

const stripDataPart = (markup: string): string => markup.replace(/\s*data-part="[^"]*"/g, '')

const formatMarkup = (markup: string): string => markup.replace(/></g, '>\n<')

const toCamelCase = (property: string): string =>
  property.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())

const decodeEntities = (value: string): string =>
  value
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')

const cssTextToStyleObject = (cssText: string): string => {
  const entries = decodeEntities(cssText)
    .split(';')
    .map((declaration) => declaration.trim())
    .filter((declaration) => declaration.length > 0)
    .map((declaration) => {
      const separatorIndex = declaration.indexOf(':')
      const property = declaration.slice(0, separatorIndex).trim()
      const value = declaration.slice(separatorIndex + 1).trim()
      return `${toCamelCase(property)}: ${JSON.stringify(value)}`
    })
  return `{ ${entries.join(', ')} }`
}

const INDENT_UNIT = '  '

const indentMarkup = (markup: string): string => {
  let depth = 0
  return markup
    .split('\n')
    .map((rawLine) => {
      const line = rawLine.trim()
      if (line.length === 0) {
        return ''
      }
      const isClose = line.startsWith('</')
      const isSelfClose = line.endsWith('/>')
      const isOpenOnly =
        line.startsWith('<') && !isClose && !isSelfClose && !line.includes('</') && line.endsWith('>')
      if (isClose) {
        depth = Math.max(0, depth - 1)
      }
      const output = INDENT_UNIT.repeat(depth) + line
      if (isOpenOnly) {
        depth += 1
      }
      return output
    })
    .join('\n')
}

const markupToJsx = (markup: string): string =>
  indentMarkup(
    stripDataPart(formatMarkup(markup))
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
      .replace(/style="([^"]*)"/g, (_, cssText: string) => `style={${cssTextToStyleObject(cssText)}}`),
  )

const renderRawMarkup = ({ templateId, card, theme }: CardExportInput): string =>
  renderToStaticMarkup(createElement(CardRenderer, { templateId, card, theme }))

const resolveMarkers = (jsx: string): string =>
  jsx
    .replace(/@@COMP:(\w+)@@/g, (_, name: string) => `<${name} />`)
    .replace(
      /@@CHIP:([^@]*)@@/g,
      (_, encoded: string) => `<Chip label=${JSON.stringify(decodeURIComponent(encoded))} />`,
    )

const liftPart = (
  root: HTMLElement,
  part: string,
  componentName: string,
  bodies: Map<string, string>,
): void => {
  const element = root.querySelector(`[data-part="${part}"]`)
  if (element === null) {
    return
  }
  const clone = element.cloneNode(true) as HTMLElement
  clone.removeAttribute('data-part')
  bodies.set(componentName, resolveMarkers(markupToJsx(clone.outerHTML)))
  element.replaceWith(root.ownerDocument.createTextNode(`@@COMP:${componentName}@@`))
}

const buildChipComponent = (root: HTMLElement): string | null => {
  const chips = Array.from(root.querySelectorAll('[data-part="chip"]'))
  if (chips.length === 0) {
    return null
  }
  const template = chips[0]!.cloneNode(true) as HTMLElement
  template.removeAttribute('data-part')
  template.textContent = '@@LABEL@@'
  const body = markupToJsx(template.outerHTML).replace('@@LABEL@@', '{label}')

  for (const chip of chips) {
    const label = chip.textContent ?? ''
    chip.replaceWith(root.ownerDocument.createTextNode(`@@CHIP:${encodeURIComponent(label)}@@`))
  }
  return body
}

const wrapComponent = (name: string, body: string, props = ''): string =>
  `const ${name} = (${props}) => (\n${body}\n)`

const buildDecomposedReact = (rawMarkup: string): string => {
  const doc = new DOMParser().parseFromString(`<body>${rawMarkup}</body>`, 'text/html')
  const root = doc.body.firstElementChild
  if (root === null) {
    throw new Error('Empty markup')
  }

  const bodies = new Map<string, string>()
  const chipBody = buildChipComponent(root as HTMLElement)
  liftPart(root as HTMLElement, 'text', 'CardText', bodies)
  liftPart(root as HTMLElement, 'mockup-area', 'CardMockups', bodies)

  const rootBody = resolveMarkers(markupToJsx(root.outerHTML))

  const declarations: string[] = []
  if (chipBody !== null) {
    declarations.push(wrapComponent('Chip', chipBody, '{ label }: { label: string }'))
  }
  const cardText = bodies.get('CardText')
  if (cardText !== undefined) {
    declarations.push(wrapComponent('CardText', cardText))
  }
  const cardMockups = bodies.get('CardMockups')
  if (cardMockups !== undefined) {
    declarations.push(wrapComponent('CardMockups', cardMockups))
  }
  declarations.push(`export ${wrapComponent('ShowcaseCard', rootBody)}`)

  return `${declarations.join('\n\n')}\n`
}

const buildFlatReact = (rawMarkup: string): string =>
  `export const ShowcaseCard = () => (\n${resolveMarkers(markupToJsx(rawMarkup))}\n)\n`

const buildReact = (rawMarkup: string): string => {
  try {
    return buildDecomposedReact(rawMarkup)
  } catch {
    return buildFlatReact(rawMarkup)
  }
}

const buildHtmlDocument = (rawMarkup: string, title: string): string =>
  `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtmlText(title)}</title>
<style>body { margin: 0; }</style>
</head>
<body>
${indentMarkup(stripDataPart(formatMarkup(rawMarkup)))}
</body>
</html>
`

export const buildCardCode = (input: CardExportInput, format: CodeExportFormat): string => {
  const rawMarkup = renderRawMarkup(input)
  return format === 'html' ? buildHtmlDocument(rawMarkup, input.card.title) : buildReact(rawMarkup)
}

const codeFileName = (input: CardExportInput, format: CodeExportFormat): string =>
  format === 'html' ? `${input.fileSlug}.html` : 'ShowcaseCard.tsx'

const downloadText = (text: string, fileName: string, mime: string): void => {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  try {
    downloadUrl(url, fileName)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export const downloadCardCode = (input: CardExportInput, format: CodeExportFormat): void => {
  const mime = format === 'html' ? 'text/html' : 'text/plain'
  downloadText(buildCardCode(input, format), codeFileName(input, format), mime)
}
