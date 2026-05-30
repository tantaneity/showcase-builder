const HEX_SHORT_LENGTH = 4
const FULL_CHANNEL_MAX = 255
const LIGHTNESS_THRESHOLD = 0.6

const expandHex = (hex: string): string => {
  const value = hex.replace('#', '')
  if (value.length === HEX_SHORT_LENGTH - 1) {
    return value
      .split('')
      .map((char) => char + char)
      .join('')
  }
  return value
}

const channel = (value: string, start: number): number =>
  Number.parseInt(value.slice(start, start + 2), 16) / FULL_CHANNEL_MAX

export const isLightColor = (hex: string): boolean => {
  const value = expandHex(hex)
  if (value.length < 6) {
    return false
  }
  const red = channel(value, 0)
  const green = channel(value, 2)
  const blue = channel(value, 4)
  const relativeLuminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
  return relativeLuminance > LIGHTNESS_THRESHOLD
}
