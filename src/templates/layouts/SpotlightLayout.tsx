import { CardShell } from '../parts/CardShell'
import { Mockup } from '../parts/Mockup'
import { TextBlock } from '../parts/TextBlock'
import type { LayoutProps } from '../types'

const SPOTLIGHT_MOCKUP_WIDTH = 760

export const SpotlightLayout = (props: LayoutProps) => (
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
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Mockup {...props} width={SPOTLIGHT_MOCKUP_WIDTH} />
      </div>
    </div>
  </CardShell>
)
