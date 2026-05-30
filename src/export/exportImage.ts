import { toPng, toSvg } from 'html-to-image'
import { EXPORT_PIXEL_RATIO_BASE } from '../constants'
import { downloadUrl } from '../utils/download'

export type ImageExportFormat = 'png' | 'svg'

interface ExportCardImageParams {
  readonly node: HTMLElement
  readonly format: ImageExportFormat
  readonly scale: number
  readonly fileSlug: string
}

const renderDataUrl = (
  node: HTMLElement,
  format: ImageExportFormat,
  pixelRatio: number,
): Promise<string> => {
  const options = { pixelRatio, cacheBust: true }
  return format === 'png' ? toPng(node, options) : toSvg(node, options)
}

export const exportCardImage = async ({
  node,
  format,
  scale,
  fileSlug,
}: ExportCardImageParams): Promise<void> => {
  const pixelRatio = EXPORT_PIXEL_RATIO_BASE * scale
  const dataUrl = await renderDataUrl(node, format, pixelRatio)
  downloadUrl(dataUrl, `${fileSlug}.${format}`)
}
