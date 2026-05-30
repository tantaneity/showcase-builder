import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from '../../constants'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'

export const TextFields = () => {
  const activeCard = useActiveCard()
  const updateActiveCard = useDocumentStore((state) => state.updateActiveCard)

  return (
    <>
      <label className="field">
        <span className="field__label">Title</span>
        <input
          className="input"
          value={activeCard.title}
          maxLength={MAX_TITLE_LENGTH}
          onChange={(event) => updateActiveCard({ title: event.target.value })}
        />
      </label>
      <label className="field">
        <span className="field__label">Description</span>
        <textarea
          className="input input--textarea"
          rows={4}
          value={activeCard.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(event) => updateActiveCard({ description: event.target.value })}
        />
      </label>
    </>
  )
}
