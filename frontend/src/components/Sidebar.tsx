import { CountryId, FilterState } from '../types/coffee'
import { DualRangeSlider } from './DualRangeSlider'

interface SidebarProps {
  filters: FilterState
  onCountryToggle: (country: CountryId) => void
  onMilkRangeChange: (values: [number, number]) => void
  onStrengthRangeChange: (values: [number, number]) => void
  onVolumeRangeChange: (values: [number, number]) => void
}

export function Sidebar({
  filters,
  onCountryToggle,
  onMilkRangeChange,
  onStrengthRangeChange,
  onVolumeRangeChange,
}: SidebarProps) {
  return (
    <aside className="panel rounded-2xl p-4">
      <h2 className="mb-4 font-display text-base font-semibold text-white">Filters</h2>

      <div className="space-y-4">
        <section>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Landkaart</p>
          <div className="rounded-xl border border-white/10 bg-night-800/70 p-2">
            <svg viewBox="0 0 220 140" className="h-28 w-full" role="img" aria-label="Kies landen op kaart">
              <polygon
                points="15,40 45,30 50,50 55,45 60,55 55,70 65,75 60,90 50,95 45,85 40,95 30,90 25,70 20,75 15,65"
                fill={filters.countries.includes('spain') ? '#59b2ff' : '#334155'}
                stroke="#d1d5db"
                strokeWidth="1.2"
                style={{ cursor: 'pointer' }}
                onClick={() => onCountryToggle('spain')}
              />
              <polygon
                points="140,35 160,30 165,45 168,50 165,70 170,90 165,110 155,115 150,95 145,100 140,85 135,70 138,50"
                fill={filters.countries.includes('italy') ? '#f4b183' : '#334155'}
                stroke="#d1d5db"
                strokeWidth="1.2"
                style={{ cursor: 'pointer' }}
                onClick={() => onCountryToggle('italy')}
              />
              <polygon
                points="88,38 104,34 114,40 116,55 108,70 95,74 84,66 82,50"
                fill={filters.countries.includes('france') ? '#93c5fd' : '#334155'}
                stroke="#d1d5db"
                strokeWidth="1.2"
                style={{ cursor: 'pointer' }}
                onClick={() => onCountryToggle('france')}
              />
              <text x="36" y="110" fontSize="10" fill="#cbd5e1">
                Spanje
              </text>
              <text x="82" y="95" fontSize="10" fill="#cbd5e1">
                Frankrijk
              </text>
              <text x="142" y="126" fontSize="10" fill="#cbd5e1">
                Italie
              </text>
            </svg>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(['italy', 'spain', 'france'] as CountryId[]).map((country) => {
              const active = filters.countries.includes(country)
              return (
                <button
                  key={country}
                  onClick={() => onCountryToggle(country)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    active
                      ? 'bg-coffee-400 text-night-950'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {country === 'italy' ? 'Italie' : country === 'spain' ? 'Spanje' : 'Frankrijk'}
                </button>
              )
            })}
          </div>
        </section>

        <section>
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-400">Melkfilter</p>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Zonder melk</span>
              <span>Oplopend melkgehalte</span>
            </div>
            <div className="h-1 rounded-full bg-gradient-to-r from-slate-500 via-coffee-400 to-amber-100" />
          </div>
        </section>

        <DualRangeSlider
          label="Melk"
          min={0}
          max={100}
          value={filters.milkRange}
          onChange={onMilkRangeChange}
          formatValue={(value) => `${value}%`}
        />

        <DualRangeSlider
          label="Sterkte"
          min={1}
          max={5}
          value={filters.strength}
          onChange={onStrengthRangeChange}
        />

        <DualRangeSlider
          label="Volume"
          min={20}
          max={300}
          value={filters.volume}
          onChange={onVolumeRangeChange}
          formatValue={(value) => `${value}ml`}
        />
      </div>
    </aside>
  )
}
