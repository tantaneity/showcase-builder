import { MockupFrameToggle } from './MockupFrameToggle'
import { ScreenshotField } from './ScreenshotField'
import { StackTagsInput } from './StackTagsInput'
import { TextFields } from './TextFields'

export const EditorPanel = () => (
  <section className="panel">
    <h2 className="panel__title">Card</h2>
    <ScreenshotField />
    <TextFields />
    <MockupFrameToggle />
    <StackTagsInput />
  </section>
)
