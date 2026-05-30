import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEY } from '../constants'
import { createEmptyCard, createEmptyDocument } from '../model/defaults'
import type {
  CardContentPatch,
  ScreenshotSlot,
  ShowcaseCard,
  ShowcaseDocument,
  TemplateId,
} from '../model/document'

interface DocumentState {
  readonly document: ShowcaseDocument
  readonly activeCardId: string
}

interface DocumentActions {
  setTemplate: (templateId: TemplateId) => void
  addCard: () => void
  removeCard: (cardId: string) => void
  setActiveCard: (cardId: string) => void
  updateActiveCard: (patch: CardContentPatch) => void
  setActiveScreenshot: (screenshot: ScreenshotSlot | null) => void
  replaceDocument: (document: ShowcaseDocument) => void
}

type DocumentStore = DocumentState & DocumentActions

const createInitialState = (): DocumentState => {
  const document = createEmptyDocument()
  return { document, activeCardId: document.cards[0]!.id }
}

const mapActiveCard = (
  state: DocumentState,
  transform: (card: ShowcaseCard) => ShowcaseCard,
): readonly ShowcaseCard[] =>
  state.document.cards.map((card) =>
    card.id === state.activeCardId ? transform(card) : card,
  )

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      ...createInitialState(),

      setTemplate: (templateId) =>
        set((state) => ({ document: { ...state.document, templateId } })),

      addCard: () =>
        set((state) => {
          const card = createEmptyCard()
          return {
            document: { ...state.document, cards: [...state.document.cards, card] },
            activeCardId: card.id,
          }
        }),

      removeCard: (cardId) =>
        set((state) => {
          if (state.document.cards.length <= 1) {
            return state
          }
          const cards = state.document.cards.filter((card) => card.id !== cardId)
          const activeCardId =
            state.activeCardId === cardId ? cards[0]!.id : state.activeCardId
          return { document: { ...state.document, cards }, activeCardId }
        }),

      setActiveCard: (cardId) => set({ activeCardId: cardId }),

      updateActiveCard: (patch) =>
        set((state) => ({
          document: {
            ...state.document,
            cards: mapActiveCard(state, (card) => ({ ...card, ...patch })),
          },
        })),

      setActiveScreenshot: (screenshot) =>
        set((state) => ({
          document: {
            ...state.document,
            cards: mapActiveCard(state, (card) => ({ ...card, screenshot })),
          },
        })),

      replaceDocument: (document) =>
        set({ document, activeCardId: document.cards[0]!.id }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        document: state.document,
        activeCardId: state.activeCardId,
      }),
    },
  ),
)
