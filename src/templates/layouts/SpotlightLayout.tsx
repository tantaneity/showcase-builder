import { cardInner } from '../cardGeometry'
import { CardShell } from '../parts/CardShell'
import { MockupArea } from '../parts/MockupArea'
import { TextBlock } from '../parts/TextBlock'
import type { LayoutProps } from '../types'

const MOCKUP_HEIGHT_RATIO = 0.66
const MOCKUP_WIDTH_RATIO = 0.92

export const SpotlightLayout = (props: LayoutProps) => {
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
          gap: 28,
          width: '100%',
          height: '100%',
        }}
      >
        <TextBlock {...props} align="center" />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
          <MockupArea {...props} maxWidth={innerWidth * MOCKUP_WIDTH_RATIO} maxHeight={innerHeight * MOCKUP_HEIGHT_RATIO} />
        </div>
      </div>
    </CardShell>
  )
}
