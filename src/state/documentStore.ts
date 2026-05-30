import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_SCREENSHOTS, STORAGE_KEY, STORAGE_SCHEMA_VERSION } from '../constants'
import { createEmptyCard, createEmptyDocument } from '../model/defaults'
import type {
  CardContentPatch,
  ScreenshotSlot,
  ShowcaseCard,
  ShowcaseDocument,
  TemplateId,
} from '../model/document'
import type { CardThemePatch } from '../model/theme'
import { getDefaultTheme } from '../templates/registry'

interface DocumentState {
  readonly document: ShowcaseDocument
  readonly activeCardId: string
}

interface DocumentActions {
  setTemplate: (templateId: TemplateId) => void
  setTheme: (patch: CardThemePatch) => void
  addCard: () => void
  removeCard: (cardId: string) => void
  setActiveCard: (cardId: string) => void
  updateActiveCard: (patch: CardContentPatch) => void
  addActiveScreenshot: (screenshot: ScreenshotSlot) => void
  removeActiveScreenshot: (index: number) => void
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
        set((state) => ({
          document: { ...state.document, templateId, theme: getDefaultTheme(templateId) },
        })),

      setTheme: (patch) =>
        set((state) => ({
          document: { ...state.document, theme: { ...state.document.theme, ...patch } },
        })),

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

      addActiveScreenshot: (screenshot) =>
        set((state) => ({
          document: {
            ...state.document,
            cards: mapActiveCard(state, (card) =>
              card.screenshots.length >= MAX_SCREENSHOTS
                ? card
                : { ...card, screenshots: [...card.screenshots, screenshot] },
            ),
          },
        })),

      removeActiveScreenshot: (index) =>
        set((state) => ({
          document: {
            ...state.document,
            cards: mapActiveCard(state, (card) => ({
              ...card,
              screenshots: card.screenshots.filter((_, position) => position !== index),
            })),
          },
        })),

      replaceDocument: (document) =>
        set({ document, activeCardId: document.cards[0]!.id }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_SCHEMA_VERSION,
      migrate: () => createInitialState(),
      partialize: (state) => ({
        document: state.document,
        activeCardId: state.activeCardId,
      }),
    },
  ),
)
