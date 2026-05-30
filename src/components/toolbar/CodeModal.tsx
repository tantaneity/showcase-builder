import { useEffect, useMemo, useState } from 'react'
import { buildCardCode, downloadCardCode } from '../../export/exportCode'
import type { CodeExportFormat } from '../../export/exportCode'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'
import { toFileSlug } from '../../utils/slug'

const FORMAT_TABS: readonly { readonly id: CodeExportFormat; readonly label: string }[] = [
  { id: 'react', label: 'React' },
  { id: 'html', label: 'HTML' },
]

const COPIED_RESET_MS = 1500

interface CodeModalProps {
  readonly onClose: () => void
}

export const CodeModal = ({ onClose }: CodeModalProps) => {
  const templateId = useDocumentStore((state) => state.document.templateId)
  const theme = useDocumentStore((state) => state.document.theme)
  const activeCard = useActiveCard()
  const [format, setFormat] = useState<CodeExportFormat>('react')
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const input = useMemo(
    () => ({ templateId, card: activeCard, theme, fileSlug: toFileSlug(activeCard.title) }),
    [templateId, activeCard, theme],
  )
  const code = useMemo(() => buildCardCode(input, format), [input, format])

  useEffect(() => {
    if (!copied) {
      return
    }
    const timer = window.setTimeout(() => setCopied(false), COPIED_RESET_MS)
    return () => window.clearTimeout(timer)
  }, [copied])

  useEffect(() => {
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Clipboard unavailable')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <header className="modal__head">
          <div className="modal__tabs">
            {FORMAT_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`modal__tab${format === tab.id ? ' modal__tab--active' : ''}`}
                onClick={() => setFormat(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button type="button" className="modal__close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </header>

        <pre className="modal__code">
          <code>{code}</code>
        </pre>

        <footer className="modal__actions">
          {errorMessage !== null && <span className="export-bar__error">{errorMessage}</span>}
          <button type="button" className="button" onClick={() => downloadCardCode(input, format)}>
            Download
          </button>
          <button type="button" className="button button--primary" onClick={() => void handleCopy()}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </footer>
      </div>
    </div>
  )
}
