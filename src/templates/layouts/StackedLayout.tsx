import { CardShell } from '../parts/CardShell'
import { Mockup } from '../parts/Mockup'
import { TextBlock } from '../parts/TextBlock'
import type { LayoutProps } from '../types'

const STACKED_MOCKUP_WIDTH = 640

export const StackedLayout = (props: LayoutProps) => (
  <CardShell {...props}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 36,
        width: '100%',
        height: '100%',
      }}
    >
      <TextBlock {...props} align="center" />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Mockup {...props} width={STACKED_MOCKUP_WIDTH} />
      </div>
    </div>
  </CardShell>
)
