import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { MAX_SCREENSHOTS } from '../../constants'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'
import { readScreenshotFile } from '../../utils/readImageFile'

export const ScreenshotField = () => {
  const activeCard = useActiveCard()
  const addActiveScreenshot = useDocumentStore((state) => state.addActiveScreenshot)
  const removeActiveScreenshot = useDocumentStore((state) => state.removeActiveScreenshot)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const remaining = MAX_SCREENSHOTS - activeCard.screenshots.length
  const canAdd = remaining > 0

  const addFiles = async (files: readonly File[]): Promise<void> => {
    const accepted = files.slice(0, remaining)
    for (const file of accepted) {
      try {
        const screenshot = await readScreenshotFile(file)
        addActiveScreenshot(screenshot)
        setErrorMessage(null)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load image')
      }
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files !== null) {
      void addFiles(Array.from(event.target.files))
    }
    event.target.value = ''
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragOver(false)
    void addFiles(Array.from(event.dataTransfer.files))
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    setIsDragOver(true)
  }

  return (
    <div className="field">
      <span className="field__label">
        Screenshots
        <span className="field__counter">
          {activeCard.screenshots.length}/{MAX_SCREENSHOTS}
        </span>
      </span>

      {activeCard.screenshots.length > 0 && (
        <div className="thumb-grid">
          {activeCard.screenshots.map((screenshot, index) => (
            <div key={screenshot.dataUrl.slice(0, 32) + index} className="thumb">
              <img className="thumb__image" src={screenshot.dataUrl} alt={screenshot.fileName} />
              <button
                type="button"
                className="thumb__remove"
                aria-label="Remove screenshot"
                onClick={() => removeActiveScreenshot(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <div
          className={`dropzone dropzone--compact${isDragOver ? ' dropzone--active' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          role="button"
          tabIndex={0}
        >
          <span className="dropzone__hint">Drop images or click to add</span>
        </div>
      )}

      {errorMessage !== null && <p className="field__error">{errorMessage}</p>}
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleInputChange} />
    </div>
  )
}
