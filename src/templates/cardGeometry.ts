import { CARD_BASE_PADDING_PX, CARD_HEIGHT_PX, CARD_WIDTH_PX } from '../constants'

export interface CardInner {
  readonly innerWidth: number
  readonly innerHeight: number
}

export const cardInner = (paddingScale: number): CardInner => {
  const padding = Math.round(CARD_BASE_PADDING_PX * paddingScale)
  return {
    innerWidth: CARD_WIDTH_PX - padding * 2,
    innerHeight: CARD_HEIGHT_PX - padding * 2,
  }
}
