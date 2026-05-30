import {
  BACKGROUND_PRESETS,
  FONT_FAMILIES,
  MAX_MOCKUP_TILT,
  MAX_PADDING_SCALE,
  MIN_MOCKUP_TILT,
  MIN_PADDING_SCALE,
  resolveBackground,
} from '../../model/theme'
import type { FontFamilyId } from '../../model/theme'
import { useDocumentStore } from '../../state/documentStore'
import { ColorField, OptionToggle, SliderField, ToggleField } from './controls'

const FONT_OPTIONS = Object.entries(FONT_FAMILIES).map(([id, font]) => ({
  id: id as FontFamilyId,
  name: font.name,
}))

const BACKGROUND_KIND_OPTIONS = [
  { id: 'gradient' as const, label: 'Gradient' },
  { id: 'solid' as const, label: 'Solid' },
]

const MOCKUP_SIDE_OPTIONS = [
  { id: 'left' as const, label: 'Left' },
  { id: 'right' as const, label: 'Right' },
]

export const StylePanel = () => {
  const theme = useDocumentStore((state) => state.document.theme)
  const setTheme = useDocumentStore((state) => state.setTheme)

  return (
    <section className="panel">
      <h2 className="panel__title">Style</h2>

      <div className="field">
        <span className="field__label">Background presets</span>
        <div className="preset-row">
          {BACKGROUND_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className="preset-swatch"
              title={preset.name}
              style={{
                background: resolveBackground({
                  ...theme,
                  backgroundKind: preset.kind,
                  backgroundFrom: preset.from,
                  backgroundTo: preset.to,
                  backgroundAngle: preset.angle,
                }),
              }}
              onClick={() =>
                setTheme({
                  backgroundKind: preset.kind,
                  backgroundFrom: preset.from,
                  backgroundTo: preset.to,
                  backgroundAngle: preset.angle,
                })
              }
            />
          ))}
        </div>
      </div>

      <OptionToggle
        label="Background"
        value={theme.backgroundKind}
        options={BACKGROUND_KIND_OPTIONS}
        onChange={(backgroundKind) => setTheme({ backgroundKind })}
      />

      <div className="control-row">
        <ColorField
          label={theme.backgroundKind === 'gradient' ? 'From' : 'Color'}
          value={theme.backgroundFrom}
          onChange={(backgroundFrom) => setTheme({ backgroundFrom })}
        />
        {theme.backgroundKind === 'gradient' && (
          <ColorField
            label="To"
            value={theme.backgroundTo}
            onChange={(backgroundTo) => setTheme({ backgroundTo })}
          />
        )}
      </div>

      {theme.backgroundKind === 'gradient' && (
        <SliderField
          label="Angle"
          value={theme.backgroundAngle}
          min={0}
          max={360}
          step={1}
          suffix="°"
          onChange={(backgroundAngle) => setTheme({ backgroundAngle })}
        />
      )}

      <div className="control-row">
        <ColorField label="Accent" value={theme.accent} onChange={(accent) => setTheme({ accent })} />
        <ColorField
          label="Title"
          value={theme.textPrimary}
          onChange={(textPrimary) => setTheme({ textPrimary })}
        />
        <ColorField
          label="Text"
          value={theme.textSecondary}
          onChange={(textSecondary) => setTheme({ textSecondary })}
        />
      </div>

      <label className="control">
        <span className="control__label">Font</span>
        <select
          className="input input--select"
          value={theme.fontFamily}
          onChange={(event) => setTheme({ fontFamily: event.target.value as FontFamilyId })}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.id} value={font.id}>
              {font.name}
            </option>
          ))}
        </select>
      </label>

      <OptionToggle
        label="Mockup side"
        value={theme.mockupSide}
        options={MOCKUP_SIDE_OPTIONS}
        onChange={(mockupSide) => setTheme({ mockupSide })}
      />

      <SliderField
        label="Mockup tilt"
        value={theme.mockupTilt}
        min={MIN_MOCKUP_TILT}
        max={MAX_MOCKUP_TILT}
        step={1}
        suffix="°"
        onChange={(mockupTilt) => setTheme({ mockupTilt })}
      />

      <SliderField
        label="Padding"
        value={theme.paddingScale}
        min={MIN_PADDING_SCALE}
        max={MAX_PADDING_SCALE}
        step={0.05}
        onChange={(paddingScale) => setTheme({ paddingScale })}
      />

      <ToggleField
        label="Mockup shadow"
        checked={theme.mockupShadow}
        onChange={(mockupShadow) => setTheme({ mockupShadow })}
      />
      <ToggleField label="Glow" checked={theme.showGlow} onChange={(showGlow) => setTheme({ showGlow })} />
    </section>
  )
}
