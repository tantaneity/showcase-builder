import type { ShowcaseCard } from '../model/document'
import { useDocumentStore } from './documentStore'

export const useActiveCard = (): ShowcaseCard =>
  useDocumentStore((state) => {
    const card = state.document.cards.find((entry) => entry.id === state.activeCardId)
    return card ?? state.document.cards[0]!
  })
