import type { CSSProperties } from 'react'
import { resolveFontStack } from '../../model/theme'
import type { RenderContext } from '../types'

type TextAlign = 'left' | 'center'

interface TextBlockProps extends RenderContext {
  readonly align: TextAlign
}

export const TextBlock = ({ card, theme, variant, align }: TextBlockProps) => {
  const fontStack = resolveFontStack(theme.fontFamily)

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
    alignItems: align === 'center' ? 'center' : 'flex-start',
    textAlign: align,
    fontFamily: fontStack,
  }

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: variant.titleSize,
    lineHeight: 1.05,
    fontWeight: variant.titleWeight,
    letterSpacing: variant.titleLetterSpacing,
    textTransform: variant.uppercaseTitle ? 'uppercase' : 'none',
    color: theme.textPrimary,
  }

  const descriptionStyle: CSSProperties = {
    margin: 0,
    maxWidth: 520,
    fontSize: 21,
    lineHeight: 1.55,
    color: theme.textSecondary,
  }

  const chipRowStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: align === 'center' ? 'center' : 'flex-start',
    marginTop: 6,
  }

  const chipStyle: CSSProperties = {
    padding: '8px 16px',
    fontSize: 15,
    fontWeight: 500,
    borderRadius: variant.chipRadius,
    color: theme.textPrimary,
    background: `${theme.accent}22`,
    border: `${variant.chipBorderWidth}px solid ${theme.accent}`,
  }

  return (
    <div style={containerStyle} data-part="text">
      <h1 style={titleStyle}>{card.title}</h1>
      <p style={descriptionStyle}>{card.description}</p>
      {card.stack.length > 0 && (
        <div style={chipRowStyle}>
          {card.stack.map((item) => (
            <span key={item} style={chipStyle} data-part="chip">
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
