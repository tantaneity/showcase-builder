import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useDocumentStore } from '../../state/documentStore'
import { downloadDocument, readDocumentFromFile } from '../../persistence/projectFile'
import { useActiveCard } from '../../state/useActiveCard'
import { toFileSlug } from '../../utils/slug'

export const ProjectToolbar = () => {
  const document = useDocumentStore((state) => state.document)
  const replaceDocument = useDocumentStore((state) => state.replaceDocument)
  const activeCard = useActiveCard()
  const inputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSave = (): void => {
    downloadDocument(document, toFileSlug(activeCard.title))
  }

  const handleLoad = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) {
      return
    }
    try {
      const loaded = await readDocumentFromFile(file)
      replaceDocument(loaded)
      setErrorMessage(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load project')
    }
  }

  return (
    <section className="panel">
      <h2 className="panel__title">Project</h2>
      <div className="field__actions">
        <button type="button" className="button" onClick={handleSave}>
          Save .json
        </button>
        <button type="button" className="button" onClick={() => inputRef.current?.click()}>
          Load .json
        </button>
      </div>
      {errorMessage !== null && <p className="field__error">{errorMessage}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={handleLoad}
      />
    </section>
  )
}
