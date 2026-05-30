import type { CSSProperties } from 'react'
import { CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../constants'
import type { ShowcaseCard } from '../model/document'

const PALETTE = {
  backgroundTop: '#0d0f14',
  backgroundBottom: '#16191f',
  glow: 'rgba(99, 102, 241, 0.18)',
  textPrimary: '#f4f5f7',
  textSecondary: '#9aa1ad',
  chipBackground: 'rgba(255, 255, 255, 0.06)',
  chipBorder: 'rgba(255, 255, 255, 0.12)',
  frameChrome: '#202531',
  frameBar: '#2a3040',
  urlPill: '#11141b',
  emptyScreenshot: '#1b1f29',
  trafficRed: '#ff5f57',
  trafficYellow: '#febc2e',
  trafficGreen: '#28c840',
} as const

const METRICS = {
  padding: 72,
  columnGap: 56,
  titleSize: 52,
  descriptionSize: 21,
  chipGap: 10,
  browserTilt: -14,
  phoneTilt: -10,
  perspective: 1400,
} as const

const rootStyle: CSSProperties = {
  position: 'relative',
  width: CARD_WIDTH_PX,
  height: CARD_HEIGHT_PX,
  display: 'grid',
  gridTemplateColumns: '1fr 1.15fr',
  gap: METRICS.columnGap,
  alignItems: 'center',
  padding: METRICS.padding,
  boxSizing: 'border-box',
  background: `radial-gradient(circle at 78% 18%, ${PALETTE.glow}, transparent 45%), linear-gradient(160deg, ${PALETTE.backgroundTop}, ${PALETTE.backgroundBottom})`,
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  overflow: 'hidden',
}

const textColumnStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
}

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: METRICS.titleSize,
  lineHeight: 1.05,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  color: PALETTE.textPrimary,
}

const descriptionStyle: CSSProperties = {
  margin: 0,
  fontSize: METRICS.descriptionSize,
  lineHeight: 1.55,
  color: PALETTE.textSecondary,
}

const chipRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: METRICS.chipGap,
  marginTop: 8,
}

const chipStyle: CSSProperties = {
  padding: '8px 16px',
  borderRadius: 999,
  fontSize: 15,
  fontWeight: 500,
  color: PALETTE.textPrimary,
  background: PALETTE.chipBackground,
  border: `1px solid ${PALETTE.chipBorder}`,
}

const mockupColumnStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  perspective: METRICS.perspective,
}

const screenshotImageStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const emptyScreenshotStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  background: PALETTE.emptyScreenshot,
  color: PALETTE.textSecondary,
  fontSize: 16,
}

const buildTiltStyle = (tiltDegrees: number): CSSProperties => ({
  transform: `rotateY(${tiltDegrees}deg) rotateX(4deg)`,
  transformStyle: 'preserve-3d',
  boxShadow: '0 40px 80px rgba(0, 0, 0, 0.55)',
  borderRadius: 16,
})

const trafficLights = [PALETTE.trafficRed, PALETTE.trafficYellow, PALETTE.trafficGreen]

interface ScreenshotProps {
  readonly dataUrl: string | null
  readonly altText: string
}

const Screenshot = ({ dataUrl, altText }: ScreenshotProps) =>
  dataUrl !== null ? (
    <img src={dataUrl} alt={altText} style={screenshotImageStyle} />
  ) : (
    <div style={emptyScreenshotStyle}>Add a screenshot</div>
  )

interface FrameProps {
  readonly card: ShowcaseCard
}

const BrowserMockup = ({ card }: FrameProps) => (
  <div style={{ ...buildTiltStyle(METRICS.browserTilt), width: 560, overflow: 'hidden' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        background: PALETTE.frameChrome,
      }}
    >
      {trafficLights.map((color) => (
        <span
          key={color}
          style={{ width: 12, height: 12, borderRadius: 999, background: color }}
        />
      ))}
      <div
        style={{
          marginLeft: 12,
          flex: 1,
          height: 22,
          borderRadius: 999,
          background: PALETTE.urlPill,
        }}
      />
    </div>
    <div style={{ width: '100%', height: 360, background: PALETTE.frameBar }}>
      <Screenshot dataUrl={card.screenshot?.dataUrl ?? null} altText={card.title} />
    </div>
  </div>
)

const PhoneMockup = ({ card }: FrameProps) => (
  <div
    style={{
      ...buildTiltStyle(METRICS.phoneTilt),
      width: 300,
      height: 600,
      padding: 14,
      background: PALETTE.frameChrome,
      borderRadius: 44,
      overflow: 'hidden',
    }}
  >
    <div style={{ width: '100%', height: '100%', borderRadius: 32, overflow: 'hidden' }}>
      <Screenshot dataUrl={card.screenshot?.dataUrl ?? null} altText={card.title} />
    </div>
  </div>
)

interface DarkEditorialProps {
  readonly card: ShowcaseCard
}

export const DarkEditorial = ({ card }: DarkEditorialProps) => (
  <div style={rootStyle}>
    <div style={textColumnStyle}>
      <h1 style={titleStyle}>{card.title}</h1>
      <p style={descriptionStyle}>{card.description}</p>
      {card.stack.length > 0 && (
        <div style={chipRowStyle}>
          {card.stack.map((item) => (
            <span key={item} style={chipStyle}>
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
    <div style={mockupColumnStyle}>
      {card.mockupFrame === 'browser' ? (
        <BrowserMockup card={card} />
      ) : (
        <PhoneMockup card={card} />
      )}
    </div>
  </div>
)
