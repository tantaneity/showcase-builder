import { MOCKUP_FRAMES } from '../../constants'
import type { MockupFrame } from '../../model/document'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'

const FRAME_LABELS: Record<MockupFrame, string> = {
  browser: 'Browser',
  phone: 'Phone',
  none: 'Plain',
}

export const MockupFrameToggle = () => {
  const activeCard = useActiveCard()
  const updateActiveCard = useDocumentStore((state) => state.updateActiveCard)

  return (
    <div className="field">
      <span className="field__label">Mockup frame</span>
      <div className="segmented">
        {MOCKUP_FRAMES.map((frame) => (
          <button
            key={frame}
            type="button"
            className={`segmented__option${
              activeCard.mockupFrame === frame ? ' segmented__option--active' : ''
            }`}
            onClick={() => updateActiveCard({ mockupFrame: frame })}
          >
            {FRAME_LABELS[frame]}
          </button>
        ))}
      </div>
    </div>
  )
}
