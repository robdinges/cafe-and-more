import { CountryId, FilterState } from '../types/coffee'

interface SidebarProps {
  filters: FilterState
  onCountryToggle: (country: CountryId) => void
  onMilkLevelChange: (milkLevel: FilterState['milkLevel']) => void
  onStrengthRangeChange: (values: [number, number]) => void
  onVolumeRangeChange: (values: [number, number]) => void
}

export function Sidebar({
  filters,
  onCountryToggle,
  onMilkLevelChange,
  onStrengthRangeChange,
  onVolumeRangeChange,
}: SidebarProps) {
  return (
    <aside className="panel rounded-2xl p-4">
      <h2 className="mb-4 font-display text-base font-semibold text-white">Filters</h2>

      <div className="space-y-4">
        <section>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Country</p>
          <div className="flex flex-wrap gap-2">
            {(['italy', 'spain'] as CountryId[]).map((country) => {
              const active = filters.countries.includes(country)
              return (
                <button
                  key={country}
                  onClick={() => onCountryToggle(country)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    active
                      ? 'bg-coffee-400 text-night-950'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {country[0].toUpperCase() + country.slice(1)}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Milk level</p>
          <div className="grid grid-cols-2 gap-2">
            {(['all', 'none', 'little', 'much'] as const).map((level) => (
              <button
                key={level}
                onClick={() => onMilkLevelChange(level)}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  filters.milkLevel === level
                    ? 'border-coffee-200 bg-coffee-400/30 text-coffee-50'
                    : 'border-white/10 bg-white/5 text-slate-200 hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
            <span>Strength</span>
            <span>
              {filters.strength[0]}-{filters.strength[1]}
            </span>
          </div>
          <input
            className="range-input"
            type="range"
            min={1}
            max={5}
            value={filters.strength[0]}
            onChange={(event) =>
              onStrengthRangeChange([
                Math.min(Number(event.target.value), filters.strength[1]),
                filters.strength[1],
              ])
            }
          />
          <input
            className="range-input mt-2"
            type="range"
            min={1}
            max={5}
            value={filters.strength[1]}
            onChange={(event) =>
              onStrengthRangeChange([
                filters.strength[0],
                Math.max(Number(event.target.value), filters.strength[0]),
              ])
            }
          />
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
            <span>Volume (ml)</span>
            <span>
              {filters.volume[0]}-{filters.volume[1]}
            </span>
          </div>
          <input
            className="range-input"
            type="range"
            min={20}
            max={300}
            value={filters.volume[0]}
            onChange={(event) =>
              onVolumeRangeChange([
                Math.min(Number(event.target.value), filters.volume[1]),
                filters.volume[1],
              ])
            }
          />
          <input
            className="range-input mt-2"
            type="range"
            min={20}
            max={300}
            value={filters.volume[1]}
            onChange={(event) =>
              onVolumeRangeChange([
                filters.volume[0],
                Math.max(Number(event.target.value), filters.volume[0]),
              ])
            }
          />
        </section>
      </div>
    </aside>
  )
}
