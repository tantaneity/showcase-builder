interface ColorFieldProps {
  readonly label: string
  readonly value: string
  readonly onChange: (value: string) => void
}

export const ColorField = ({ label, value, onChange }: ColorFieldProps) => (
  <label className="control control--color">
    <span className="control__label">{label}</span>
    <span className="control__swatch" style={{ background: value }}>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </span>
  </label>
)

interface SliderFieldProps {
  readonly label: string
  readonly value: number
  readonly min: number
  readonly max: number
  readonly step: number
  readonly suffix?: string
  readonly onChange: (value: number) => void
}

export const SliderField = ({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: SliderFieldProps) => (
  <label className="control">
    <span className="control__label">
      {label}
      <span className="control__value">
        {value}
        {suffix}
      </span>
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </label>
)

interface ToggleFieldProps {
  readonly label: string
  readonly checked: boolean
  readonly onChange: (checked: boolean) => void
}

export const ToggleField = ({ label, checked, onChange }: ToggleFieldProps) => (
  <label className="control control--toggle">
    <span className="control__label">{label}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
    />
  </label>
)

interface OptionToggleProps<T extends string> {
  readonly label: string
  readonly value: T
  readonly options: readonly { readonly id: T; readonly label: string }[]
  readonly onChange: (value: T) => void
}

export const OptionToggle = <T extends string>({
  label,
  value,
  options,
  onChange,
}: OptionToggleProps<T>) => (
  <div className="control">
    <span className="control__label">{label}</span>
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`segmented__option${
            value === option.id ? ' segmented__option--active' : ''
          }`}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
)
