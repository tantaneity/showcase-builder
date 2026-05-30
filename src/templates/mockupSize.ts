import type { MockupFrame } from '../model/document'

export const BROWSER_BODY_ASPECT = 0.64
export const PHONE_OUTER_ASPECT = 2
export const CHROME_BAR_HEIGHT = 46

interface MockupSizeInput {
  readonly frame: MockupFrame
  readonly maxWidth: number
  readonly maxHeight: number
  readonly showChrome: boolean
}

export const computeMockupWidth = ({ frame, maxWidth, maxHeight, showChrome }: MockupSizeInput): number => {
  if (frame === 'phone') {
    return Math.min(maxWidth, maxHeight / PHONE_OUTER_ASPECT)
  }
  const chromeHeight = frame === 'browser' && showChrome ? CHROME_BAR_HEIGHT : 0
  const widthFromHeight = (maxHeight - chromeHeight) / BROWSER_BODY_ASPECT
  return Math.max(0, Math.min(maxWidth, widthFromHeight))
}

export const computeMockupHeight = (
  frame: MockupFrame,
  width: number,
  showChrome: boolean,
): number => {
  if (frame === 'phone') {
    return width * PHONE_OUTER_ASPECT
  }
  const chromeHeight = frame === 'browser' && showChrome ? CHROME_BAR_HEIGHT : 0
  return width * BROWSER_BODY_ASPECT + chromeHeight
}
