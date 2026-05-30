import { CardShell } from '../parts/CardShell'
import { Mockup } from '../parts/Mockup'
import { TextBlock } from '../parts/TextBlock'
import type { LayoutProps } from '../types'

const SPLIT_MOCKUP_WIDTH = 560

export const SplitLayout = (props: LayoutProps) => {
  const mockupOnRight = props.theme.mockupSide === 'right'

  const text = (
    <div key="text" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <TextBlock {...props} align="left" />
    </div>
  )
  const mockup = (
    <div
      key="mockup"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
    >
      <Mockup {...props} width={SPLIT_MOCKUP_WIDTH} />
    </div>
  )

  return (
    <CardShell {...props}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mockupOnRight ? '1fr 1.15fr' : '1.15fr 1fr',
          gap: 56,
          width: '100%',
          height: '100%',
        }}
      >
        {mockupOnRight ? [text, mockup] : [mockup, text]}
      </div>
    </CardShell>
  )
}
