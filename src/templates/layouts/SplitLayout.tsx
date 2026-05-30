import { cardInner } from '../cardGeometry'
import { CardShell } from '../parts/CardShell'
import { MockupArea } from '../parts/MockupArea'
import { TextBlock } from '../parts/TextBlock'
import type { LayoutProps } from '../types'

const COLUMN_GAP = 56
const MOCKUP_COLUMN_RATIO = 1.15 / 2.15

export const SplitLayout = (props: LayoutProps) => {
  const hasMockup = props.card.screenshots.length > 0

  if (!hasMockup) {
    return (
      <CardShell {...props}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          <TextBlock {...props} align="center" />
        </div>
      </CardShell>
    )
  }

  const { innerWidth, innerHeight } = cardInner(props.theme.paddingScale)
  const mockupMaxWidth = (innerWidth - COLUMN_GAP) * MOCKUP_COLUMN_RATIO
  const mockupOnRight = props.theme.mockupSide === 'right'

  const text = (
    <div key="text" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <TextBlock {...props} align="left" />
    </div>
  )
  const mockup = (
    <div key="mockup" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <MockupArea {...props} maxWidth={mockupMaxWidth} maxHeight={innerHeight} />
    </div>
  )

  return (
    <CardShell {...props}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mockupOnRight ? '1fr 1.15fr' : '1.15fr 1fr',
          gap: COLUMN_GAP,
          width: '100%',
          height: '100%',
        }}
      >
        {mockupOnRight ? [text, mockup] : [mockup, text]}
      </div>
    </CardShell>
  )
}
