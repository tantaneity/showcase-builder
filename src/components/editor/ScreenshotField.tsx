import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import {
  ADJUST_MAX_SCALE,
  ADJUST_MIN_SCALE,
  ADJUST_OFFSET_RANGE,
  MAX_SCREENSHOTS,
} from '../../constants'
import { DEFAULT_SCREENSHOT_ADJUST } from '../../model/defaults'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'
import { readScreenshotFile } from '../../utils/readImageFile'
import { SliderField } from '../style/controls'

export const ScreenshotField = () => {
  const activeCard = useActiveCard()
  const addActiveScreenshot = useDocumentStore((state) => state.addActiveScreenshot)
  const removeActiveScreenshot = useDocumentStore((state) => state.removeActiveScreenshot)
  const updateScreenshotAdjust = useDocumentStore((state) => state.updateScreenshotAdjust)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const screenshots = activeCard.screenshots
  const remaining = MAX_SCREENSHOTS - screenshots.length
  const canAdd = remaining > 0
  const activeIndex = Math.min(selectedIndex, Math.max(0, screenshots.length - 1))
  const selected = screenshots[activeIndex]

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
          {screenshots.length}/{MAX_SCREENSHOTS}
        </span>
      </span>

      {screenshots.length > 0 && (
        <div className="thumb-grid">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.dataUrl.slice(0, 32) + index}
              className={`thumb${index === activeIndex ? ' thumb--active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              role="button"
              tabIndex={0}
            >
              <img className="thumb__image" src={screenshot.dataUrl} alt={screenshot.fileName} />
              <button
                type="button"
                className="thumb__remove"
                aria-label="Remove screenshot"
                onClick={(event) => {
                  event.stopPropagation()
                  removeActiveScreenshot(index)
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {selected !== undefined && (
        <div className="adjust">
          <div className="adjust__head">
            <span className="field__label">Adjust image</span>
            <button
              type="button"
              className="button button--ghost adjust__reset"
              onClick={() => updateScreenshotAdjust(activeIndex, DEFAULT_SCREENSHOT_ADJUST)}
            >
              Reset
            </button>
          </div>
          <SliderField
            label="Zoom"
            value={selected.adjust.scale}
            min={ADJUST_MIN_SCALE}
            max={ADJUST_MAX_SCALE}
            step={0.05}
            suffix="x"
            onChange={(scale) => updateScreenshotAdjust(activeIndex, { scale })}
          />
          <SliderField
            label="Offset X"
            value={selected.adjust.offsetX}
            min={-ADJUST_OFFSET_RANGE}
            max={ADJUST_OFFSET_RANGE}
            step={1}
            suffix="%"
            onChange={(offsetX) => updateScreenshotAdjust(activeIndex, { offsetX })}
          />
          <SliderField
            label="Offset Y"
            value={selected.adjust.offsetY}
            min={-ADJUST_OFFSET_RANGE}
            max={ADJUST_OFFSET_RANGE}
            step={1}
            suffix="%"
            onChange={(offsetY) => updateScreenshotAdjust(activeIndex, { offsetY })}
          />
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
