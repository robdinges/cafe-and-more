import { CoffeeNode } from '../types/coffee'

interface DetailPanelProps {
  node: CoffeeNode | null
  related: CoffeeNode[]
}

export function DetailPanel({
  node,
  related,
}: DetailPanelProps) {
  if (!node) {
    return (
      <section className="panel rounded-2xl p-4">
        <h2 className="font-display text-base font-semibold text-white">Details</h2>
        <p className="mt-3 text-sm text-slate-400">Select a coffee node to inspect details.</p>
      </section>
    )
  }

  return (
    <section className="panel rounded-2xl p-4">
      <h2 className="font-display text-base font-semibold text-white">{node.name}</h2>
      <p className="mt-1 text-xs uppercase tracking-wide text-coffee-200">{node.country}</p>

      <p className="mt-3 text-sm text-slate-300">{node.preparation}</p>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-white/5 p-2">
          <dt className="text-slate-400">Milk</dt>
          <dd className="font-semibold text-white">{node.milk}%</dd>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <dt className="text-slate-400">Water</dt>
          <dd className="font-semibold text-white">{node.water}%</dd>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <dt className="text-slate-400">Volume</dt>
          <dd className="font-semibold text-white">{node.volume_ml} ml</dd>
        </div>
        <div className="rounded-lg bg-white/5 p-2">
          <dt className="text-slate-400">Strength</dt>
          <dd className="font-semibold text-white">{node.strength}/5</dd>
        </div>
      </dl>

      <div className="mt-5">
        <h3 className="text-xs uppercase tracking-wide text-slate-400">Related Coffees</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {related.map((item) => (
            <li key={item.id} className="rounded-md bg-white/5 px-2 py-1 text-slate-200">
              {item.name}
            </li>
          ))}
          {related.length === 0 && <li className="text-slate-500">No related coffees in current graph.</li>}
        </ul>
      </div>
    </section>
  )
}
