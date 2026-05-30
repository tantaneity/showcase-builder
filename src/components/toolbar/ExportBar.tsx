import { useState } from 'react'
import {
  CARD_EXPORT_NODE_ID,
  DEFAULT_EXPORT_SCALE,
  EXPORT_SCALES,
} from '../../constants'
import { exportCardImage } from '../../export/exportImage'
import type { ImageExportFormat } from '../../export/exportImage'
import { useActiveCard } from '../../state/useActiveCard'
import { toFileSlug } from '../../utils/slug'
import { CodeModal } from './CodeModal'

export const ExportBar = () => {
  const activeCard = useActiveCard()
  const [scale, setScale] = useState<number>(DEFAULT_EXPORT_SCALE)
  const [isExporting, setIsExporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCodeOpen, setIsCodeOpen] = useState(false)

  const runImageExport = async (format: ImageExportFormat): Promise<void> => {
    const node = document.getElementById(CARD_EXPORT_NODE_ID)
    if (node === null) {
      setErrorMessage('Card preview is not ready')
      return
    }
    setIsExporting(true)
    setErrorMessage(null)
    try {
      await exportCardImage({ node, format, scale, fileSlug: toFileSlug(activeCard.title) })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="export-bar">
      <label className="export-bar__scale">
        Scale
        <select
          className="input input--select"
          value={scale}
          onChange={(event) => setScale(Number(event.target.value))}
        >
          {EXPORT_SCALES.map((value) => (
            <option key={value} value={value}>
              {value}x
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="button button--primary"
        disabled={isExporting}
        onClick={() => void runImageExport('png')}
      >
        {isExporting ? 'Exporting…' : 'PNG'}
      </button>
      <button
        type="button"
        className="button"
        disabled={isExporting}
        onClick={() => void runImageExport('svg')}
      >
        SVG
      </button>
      <button type="button" className="button" onClick={() => setIsCodeOpen(true)}>
        {'Code </>'}
      </button>
      {errorMessage !== null && <span className="export-bar__error">{errorMessage}</span>}
      {isCodeOpen && <CodeModal onClose={() => setIsCodeOpen(false)} />}
    </div>
  )
}
