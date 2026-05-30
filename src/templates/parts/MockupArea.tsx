import { MAX_SCREENSHOTS } from '../../constants'
import { computeMockupHeight, computeMockupWidth } from '../mockupSize'
import type { RenderContext } from '../types'
import { Mockup } from './Mockup'

const CASCADE_OFFSET_X = 46
const CASCADE_OFFSET_Y = 34

interface MockupAreaProps extends RenderContext {
  readonly maxWidth: number
  readonly maxHeight: number
}

export const MockupArea = ({ card, theme, variant, maxWidth, maxHeight }: MockupAreaProps) => {
  const slots = card.screenshots.slice(0, MAX_SCREENSHOTS)
  if (slots.length === 0) {
    return null
  }

  const count = slots.length
  const offsetX = count > 1 ? CASCADE_OFFSET_X : 0
  const offsetY = count > 1 ? CASCADE_OFFSET_Y : 0
  const showChrome = card.mockupFrame === 'browser' && variant.showBrowserChrome

  const width = computeMockupWidth({
    frame: card.mockupFrame,
    maxWidth: maxWidth - offsetX * (count - 1),
    maxHeight: maxHeight - offsetY * (count - 1),
    showChrome,
  })

  if (count === 1) {
    return (
      <div data-part="mockup-area" style={{ display: 'contents' }}>
        <Mockup
          slot={slots[0]!}
          frame={card.mockupFrame}
          theme={theme}
          variant={variant}
          width={width}
          altText={card.title}
        />
      </div>
    )
  }

  const height = computeMockupHeight(card.mockupFrame, width, showChrome)

  return (
    <div
      data-part="mockup-area"
      style={{
        position: 'relative',
        width: width + offsetX * (count - 1),
        height: height + offsetY * (count - 1),
      }}
    >
      {slots.map((slot, index) => (
        <div
          key={slot.dataUrl.slice(0, 32) + index}
          style={{
            position: 'absolute',
            left: index * offsetX,
            top: index * offsetY,
            zIndex: index,
          }}
        >
          <Mockup
            slot={slot}
            frame={card.mockupFrame}
            theme={theme}
            variant={variant}
            width={width}
            altText={card.title}
          />
        </div>
      ))}
    </div>
  )
}
