import type { CSSProperties } from 'react'
import { isLightColor } from '../../utils/color'
import type { RenderContext } from '../types'

const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840']
const BROWSER_ASPECT = 0.64
const PHONE_ASPECT = 2
const PERSPECTIVE_PX = 1400

const chromeColors = (backgroundFrom: string) => {
  const onLight = isLightColor(backgroundFrom)
  return {
    chrome: onLight ? '#e6e6ea' : '#202531',
    bar: onLight ? '#d0d0d6' : '#2a3040',
    pill: onLight ? '#f4f4f7' : '#11141b',
    border: onLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)',
  }
}

const buildFrameTransform = (tilt: number): CSSProperties =>
  tilt === 0
    ? {}
    : {
        transform: `perspective(${PERSPECTIVE_PX}px) rotateY(${tilt}deg) rotateX(4deg)`,
      }

const buildShadow = (hasShadow: boolean): CSSProperties =>
  hasShadow ? { boxShadow: '0 40px 90px rgba(0, 0, 0, 0.55)' } : {}

interface ScreenshotProps {
  readonly dataUrl: string | null
  readonly altText: string
  readonly placeholderColor: string
}

const Screenshot = ({ dataUrl, altText, placeholderColor }: ScreenshotProps) =>
  dataUrl !== null ? (
    <img
      src={dataUrl}
      alt={altText}
      style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
    />
  ) : (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        background: placeholderColor,
        color: 'rgba(150,150,160,0.9)',
        fontSize: 16,
      }}
    >
      Add a screenshot
    </div>
  )

interface MockupProps extends RenderContext {
  readonly width: number
}

export const Mockup = ({ card, theme, variant, width }: MockupProps) => {
  const colors = chromeColors(theme.backgroundFrom)
  const frameStyle: CSSProperties = {
    ...buildFrameTransform(theme.mockupTilt),
    ...buildShadow(theme.mockupShadow),
    borderRadius: variant.mockupRadius,
    border:
      variant.frameBorderWidth > 0
        ? `${variant.frameBorderWidth}px solid ${theme.textPrimary}`
        : 'none',
    overflow: 'hidden',
  }

  if (card.mockupFrame === 'phone') {
    return (
      <div
        style={{
          ...frameStyle,
          width: width * 0.55,
          height: width * 0.55 * PHONE_ASPECT,
          padding: 12,
          background: colors.chrome,
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: Math.max(0, variant.mockupRadius - 8), overflow: 'hidden' }}>
          <Screenshot dataUrl={card.screenshot?.dataUrl ?? null} altText={card.title} placeholderColor={colors.bar} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...frameStyle, width }}>
      {variant.showBrowserChrome && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            background: colors.chrome,
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          {TRAFFIC_LIGHTS.map((color) => (
            <span key={color} style={{ width: 12, height: 12, borderRadius: 999, background: color }} />
          ))}
          <div style={{ marginLeft: 12, flex: 1, height: 22, borderRadius: 999, background: colors.pill }} />
        </div>
      )}
      <div style={{ width: '100%', height: width * BROWSER_ASPECT, background: colors.bar }}>
        <Screenshot dataUrl={card.screenshot?.dataUrl ?? null} altText={card.title} placeholderColor={colors.bar} />
      </div>
    </div>
  )
}
