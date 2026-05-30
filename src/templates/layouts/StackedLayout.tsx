import { cardInner } from '../cardGeometry'
import { CardShell } from '../parts/CardShell'
import { MockupArea } from '../parts/MockupArea'
import { TextBlock } from '../parts/TextBlock'
import type { LayoutProps } from '../types'

const MOCKUP_HEIGHT_RATIO = 0.62

export const StackedLayout = (props: LayoutProps) => {
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

  return (
    <CardShell {...props}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          width: '100%',
          height: '100%',
        }}
      >
        <TextBlock {...props} align="center" />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <MockupArea {...props} maxWidth={innerWidth} maxHeight={innerHeight * MOCKUP_HEIGHT_RATIO} />
        </div>
      </div>
    </CardShell>
  )
}
