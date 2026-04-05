import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getComparison } from '../data/api'
import { useCoffeeStore } from '../store/useCoffeeStore'

const maxVolume = 300

function MetricBar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = Math.max(8, (value / max) * 100)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-coffee-400 transition-all duration-300" style={{ width: `${width}%` }} />
      </div>
    </div>
  )
}

export function CompareView() {
  const compareIds = useCoffeeStore((state) => state.compareIds)
  const compareMetrics = useCoffeeStore((state) => state.compareMetrics)
  const setCompareMetrics = useCoffeeStore((state) => state.setCompareMetrics)
  const clearCompare = useCoffeeStore((state) => state.clearCompare)

  useEffect(() => {
    if (compareIds.length < 2) {
      setCompareMetrics([])
      return
    }

    void getComparison(compareIds).then((items) => {
      setCompareMetrics(items)
    })
  }, [compareIds, setCompareMetrics])

  return (
    <section className="space-y-4">
      <div className="panel rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-white">Compare Coffees</h2>
            <p className="text-sm text-slate-400">
              Select 2-3 coffees from the Explorer using shift+click to compare.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => clearCompare()}
              className="rounded-lg bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
            >
              Clear
            </button>
            <Link
              to="/"
              className="rounded-lg bg-coffee-400 px-3 py-2 text-sm font-semibold text-night-950 transition hover:bg-coffee-200"
            >
              Back to Explorer
            </Link>
          </div>
        </div>
      </div>

      {compareMetrics.length < 2 ? (
        <div className="panel rounded-2xl p-6 text-sm text-slate-300">
          Pick at least two coffees to activate comparison mode.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {compareMetrics.map((item) => (
            <article key={item.id} className="panel rounded-2xl p-4">
              <h3 className="font-display text-lg text-white">{item.name}</h3>
              <p className="text-xs uppercase tracking-wide text-coffee-200">{item.country}</p>
              <p className="mt-2 text-sm text-slate-300">{item.preparation}</p>
              <div className="mt-4 space-y-3">
                <MetricBar label="Milk %" value={item.milk} max={100} />
                <MetricBar label="Water %" value={item.water} max={100} />
                <MetricBar label="Volume (ml)" value={item.volume_ml} max={maxVolume} />
                <MetricBar label="Strength" value={item.strength} max={5} />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
