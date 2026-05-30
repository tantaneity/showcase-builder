import { resolveBackground } from '../../model/theme'
import { useDocumentStore } from '../../state/documentStore'
import { TEMPLATE_LIST } from '../../templates/registry'

export const TemplateGallery = () => {
  const templateId = useDocumentStore((state) => state.document.templateId)
  const setTemplate = useDocumentStore((state) => state.setTemplate)

  return (
    <div className="field">
      <span className="field__label">Template</span>
      <div className="template-gallery">
        {TEMPLATE_LIST.map((template) => (
          <button
            key={template.id}
            type="button"
            className={`template-card${
              template.id === templateId ? ' template-card--active' : ''
            }`}
            onClick={() => setTemplate(template.id)}
          >
            <span
              className="template-card__swatch"
              style={{ background: resolveBackground(template.defaultTheme) }}
            >
              <span
                className="template-card__accent"
                style={{ background: template.defaultTheme.accent }}
              />
            </span>
            <span className="template-card__name">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
