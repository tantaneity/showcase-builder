import { EditorPanel } from './components/editor/EditorPanel'
import { CardPreview } from './components/preview/CardPreview'
import { StylePanel } from './components/style/StylePanel'
import { TemplateGallery } from './components/style/TemplateGallery'
import { CardTabs } from './components/toolbar/CardTabs'
import { ExportBar } from './components/toolbar/ExportBar'
import { ProjectToolbar } from './components/toolbar/ProjectToolbar'

const App = () => (
  <div className="app">
    <header className="app__header">
      <span className="app__brand">Showcase Builder</span>
    </header>
    <div className="app__body">
      <aside className="app__sidebar">
        <EditorPanel />
        <TemplateGallery />
        <StylePanel />
        <ProjectToolbar />
      </aside>
      <main className="app__stage">
        <CardTabs />
        <CardPreview />
        <ExportBar />
      </main>
    </div>
  </div>
)

export default App
