import type { CSSProperties, ReactNode } from 'react'
import { CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../../constants'
import { resolveBackground, resolveFontStack } from '../../model/theme'
import type { RenderContext } from '../types'

const BASE_PADDING_PX = 72

interface CardShellProps extends RenderContext {
  readonly children: ReactNode
}

export const CardShell = ({ theme, variant, children }: CardShellProps) => {
  const padding = Math.round(BASE_PADDING_PX * theme.paddingScale)

  const rootStyle: CSSProperties = {
    position: 'relative',
    width: CARD_WIDTH_PX,
    height: CARD_HEIGHT_PX,
    padding,
    boxSizing: 'border-box',
    borderRadius: variant.cardRadius,
    background: resolveBackground(theme),
    fontFamily: resolveFontStack(theme.fontFamily),
    overflow: 'hidden',
  }

  const glowStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: `radial-gradient(circle at 80% 12%, ${theme.accent}33, transparent 45%)`,
  }

  return (
    <div style={rootStyle}>
      {theme.showGlow && <div style={glowStyle} />}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>{children}</div>
    </div>
  )
}
