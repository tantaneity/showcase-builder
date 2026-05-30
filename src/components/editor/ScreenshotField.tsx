import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'
import { readScreenshotFile } from '../../utils/readImageFile'

export const ScreenshotField = () => {
  const activeCard = useActiveCard()
  const setActiveScreenshot = useDocumentStore((state) => state.setActiveScreenshot)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const applyFile = async (file: File): Promise<void> => {
    try {
      const screenshot = await readScreenshotFile(file)
      setActiveScreenshot(screenshot)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load image')
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (file !== undefined) {
      void applyFile(file)
    }
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file !== undefined) {
      void applyFile(file)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragOver(true)
  }

  return (
    <div className="field">
      <span className="field__label">Screenshot</span>
      <div
        className={`dropzone${isDragOver ? ' dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        role="button"
        tabIndex={0}
      >
        {activeCard.screenshot !== null ? (
          <img
            className="dropzone__preview"
            src={activeCard.screenshot.dataUrl}
            alt={activeCard.screenshot.fileName}
          />
        ) : (
          <span className="dropzone__hint">Drop an image or click to browse</span>
        )}
      </div>
      <div className="field__actions">
        {activeCard.screenshot !== null && (
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setActiveScreenshot(null)}
          >
            Remove screenshot
          </button>
        )}
      </div>
      {errorMessage !== null && <p className="field__error">{errorMessage}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleInputChange}
      />
    </div>
  )
}
