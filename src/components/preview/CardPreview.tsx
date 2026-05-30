import { useEffect, useRef, useState } from 'react'
import { CARD_EXPORT_NODE_ID, CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../../constants'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'
import { getTemplate } from '../../templates/registry'

const MAX_PREVIEW_SCALE = 1

const useFitScale = (naturalWidth: number) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(MAX_PREVIEW_SCALE)

  useEffect(() => {
    const container = containerRef.current
    if (container === null) {
      return
    }
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0
      if (width > 0) {
        setScale(Math.min(MAX_PREVIEW_SCALE, width / naturalWidth))
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [naturalWidth])

  return { containerRef, scale }
}

export const CardPreview = () => {
  const templateId = useDocumentStore((state) => state.document.templateId)
  const activeCard = useActiveCard()
  const { containerRef, scale } = useFitScale(CARD_WIDTH_PX)
  const { Component } = getTemplate(templateId)

  return (
    <div ref={containerRef} className="card-preview">
      <div
        className="card-preview__sizer"
        style={{ width: CARD_WIDTH_PX * scale, height: CARD_HEIGHT_PX * scale }}
      >
        <div
          className="card-preview__scaler"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          <div
            id={CARD_EXPORT_NODE_ID}
            style={{ width: CARD_WIDTH_PX, height: CARD_HEIGHT_PX }}
          >
            <Component card={activeCard} />
          </div>
        </div>
      </div>
    </div>
  )
}
