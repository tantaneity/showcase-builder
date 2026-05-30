import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { MAX_STACK_TAGS } from '../../constants'
import { useActiveCard } from '../../state/useActiveCard'
import { useDocumentStore } from '../../state/documentStore'

const COMMIT_KEYS = ['Enter', ',']

export const StackTagsInput = () => {
  const activeCard = useActiveCard()
  const updateActiveCard = useDocumentStore((state) => state.updateActiveCard)
  const [draft, setDraft] = useState('')

  const isAtLimit = activeCard.stack.length >= MAX_STACK_TAGS

  const addTag = (): void => {
    const value = draft.trim()
    if (value.length === 0 || isAtLimit || activeCard.stack.includes(value)) {
      setDraft('')
      return
    }
    updateActiveCard({ stack: [...activeCard.stack, value] })
    setDraft('')
  }

  const removeTag = (tag: string): void => {
    updateActiveCard({ stack: activeCard.stack.filter((entry) => entry !== tag) })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (COMMIT_KEYS.includes(event.key)) {
      event.preventDefault()
      addTag()
    }
  }

  return (
    <div className="field">
      <span className="field__label">Stack</span>
      <div className="tags">
        {activeCard.stack.map((tag) => (
          <span key={tag} className="tag">
            {tag}
            <button
              type="button"
              className="tag__remove"
              aria-label={`Remove ${tag}`}
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className="input"
        value={draft}
        placeholder={isAtLimit ? `Limit of ${MAX_STACK_TAGS} reached` : 'Add tech, press Enter'}
        disabled={isAtLimit}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
      />
    </div>
  )
}
