import { useDocumentStore } from '../../state/documentStore'

const cardLabel = (title: string, index: number): string =>
  title.trim().length > 0 ? title : `Card ${index + 1}`

export const CardTabs = () => {
  const cards = useDocumentStore((state) => state.document.cards)
  const activeCardId = useDocumentStore((state) => state.activeCardId)
  const setActiveCard = useDocumentStore((state) => state.setActiveCard)
  const addCard = useDocumentStore((state) => state.addCard)
  const removeCard = useDocumentStore((state) => state.removeCard)

  const canRemove = cards.length > 1

  return (
    <div className="card-tabs">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`card-tabs__tab${
            card.id === activeCardId ? ' card-tabs__tab--active' : ''
          }`}
        >
          <button
            type="button"
            className="card-tabs__select"
            onClick={() => setActiveCard(card.id)}
          >
            {cardLabel(card.title, index)}
          </button>
          {canRemove && (
            <button
              type="button"
              className="card-tabs__remove"
              aria-label="Remove card"
              onClick={() => removeCard(card.id)}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button type="button" className="card-tabs__add" onClick={addCard}>
        + Card
      </button>
    </div>
  )
}
