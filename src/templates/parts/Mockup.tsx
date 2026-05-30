import type { CSSProperties } from 'react'
import type { MockupFrame, ScreenshotSlot } from '../../model/document'
import { isLightColor } from '../../utils/color'
import { BROWSER_BODY_ASPECT, CHROME_BAR_HEIGHT, PHONE_OUTER_ASPECT } from '../mockupSize'
import type { CardTheme, VariantStyle } from '../types'

const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840']
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
  tilt === 0 ? {} : { transform: `perspective(${PERSPECTIVE_PX}px) rotateY(${tilt}deg) rotateX(4deg)` }

const buildShadow = (hasShadow: boolean): CSSProperties =>
  hasShadow ? { boxShadow: '0 40px 90px rgba(0, 0, 0, 0.55)' } : {}

const Screenshot = ({ slot, altText }: { slot: ScreenshotSlot; altText: string }) => {
  const { scale, offsetX, offsetY } = slot.adjust
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <img
        src={slot.dataUrl}
        alt={altText}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${50 + offsetX}% ${50 + offsetY}%`,
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      />
    </div>
  )
}

interface MockupProps {
  readonly slot: ScreenshotSlot
  readonly frame: MockupFrame
  readonly theme: CardTheme
  readonly variant: VariantStyle
  readonly width: number
  readonly altText: string
}

export const Mockup = ({ slot, frame, theme, variant, width, altText }: MockupProps) => {
  const colors = chromeColors(theme.backgroundFrom)
  const frameStyle: CSSProperties = {
    ...buildFrameTransform(theme.mockupTilt),
    ...buildShadow(theme.mockupShadow),
    borderRadius: variant.mockupRadius,
    border: variant.frameBorderWidth > 0 ? `${variant.frameBorderWidth}px solid ${theme.textPrimary}` : 'none',
    overflow: 'hidden',
  }

  if (frame === 'phone') {
    const height = width * PHONE_OUTER_ASPECT
    return (
      <div style={{ ...frameStyle, width, height, padding: 12, background: colors.chrome }}>
        <div style={{ width: '100%', height: '100%', borderRadius: Math.max(0, variant.mockupRadius - 8), overflow: 'hidden' }}>
          <Screenshot slot={slot} altText={altText} />
        </div>
      </div>
    )
  }

  const showChrome = frame === 'browser' && variant.showBrowserChrome
  return (
    <div style={{ ...frameStyle, width }}>
      {showChrome && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: CHROME_BAR_HEIGHT,
            padding: '0 16px',
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
      <div style={{ width: '100%', height: width * BROWSER_BODY_ASPECT, background: colors.bar }}>
        <Screenshot slot={slot} altText={altText} />
      </div>
    </div>
  )
}
