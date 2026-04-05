interface DualRangeSliderProps {
  label: string
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (value: number) => string
}

export function DualRangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
}: DualRangeSliderProps) {
  const [currentMin, currentMax] = value
  const startPct = ((currentMin - min) / (max - min)) * 100
  const endPct = ((currentMax - min) / (max - min)) * 100
  const print = (input: number) => (formatValue ? formatValue(input) : String(input))

  return (
    <section>
      <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
        <span>{label}</span>
        <span>
          {print(currentMin)} - {print(currentMax)}
        </span>
      </div>

      <div className="dual-range">
        <div className="dual-range__track" />
        <div
          className="dual-range__fill"
          style={{
            left: `${startPct}%`,
            width: `${Math.max(0, endPct - startPct)}%`,
          }}
        />

        <input
          className="dual-range__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMin}
          aria-label={`${label} minimum`}
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), currentMax)
            onChange([next, currentMax])
          }}
        />

        <input
          className="dual-range__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentMax}
          aria-label={`${label} maximum`}
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), currentMin)
            onChange([currentMin, next])
          }}
        />
      </div>
    </section>
  )
}
