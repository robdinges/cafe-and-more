import { CoffeeNode, GraphEdge, RelationType } from '../types/coffee'

interface RelationStoryViewProps {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const relationLabel: Record<RelationType, string> = {
  variant_of: 'Variant van',
  similar_to: 'Soortgelijk',
  contains_milk: 'Verschil in melk',
  popular_in_country: 'Populair in land',
}

const countryLabel: Record<string, string> = {
  italy: 'Italie',
  spain: 'Spanje',
}

function diffLabel(current: number, next: number, unit: string) {
  const diff = next - current
  if (diff === 0) {
    return `0${unit}`
  }
  const sign = diff > 0 ? '+' : ''
  return `${sign}${diff}${unit}`
}

export function RelationStoryView({ nodes, edges, selectedId, onSelect }: RelationStoryViewProps) {
  const selected = nodes.find((node) => node.id === selectedId) ?? nodes[0] ?? null

  if (!selected) {
    return <div className="panel rounded-2xl p-4 text-sm text-slate-300">Geen data beschikbaar.</div>
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const related = edges
    .filter((edge) => edge.source === selected.id || edge.target === selected.id)
    .map((edge) => {
      const targetId = edge.source === selected.id ? edge.target : edge.source
      const target = nodeById.get(targetId)
      if (!target) {
        return null
      }
      return { edge, target }
    })
    .filter((item): item is { edge: GraphEdge; target: CoffeeNode } => Boolean(item))

  return (
    <div className="panel rounded-2xl p-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-wide text-coffee-200">Geselecteerde koffie</p>
        <h3 className="mt-1 font-display text-xl text-white">{selected.name}</h3>
        <p className="mt-1 text-sm text-slate-300">
          {countryLabel[selected.country]} · melk {selected.milk}% · sterkte {selected.strength} · volume {selected.volume_ml}ml
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {related.map(({ edge, target }) => (
          <button
            key={edge.id}
            onClick={() => onSelect(target.id)}
            className="w-full rounded-xl border border-white/10 bg-night-800/70 p-4 text-left transition hover:border-coffee-200/60 hover:bg-night-800"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-white">
                  {selected.name} {'->'} {target.name}
                </p>
                <p className="text-xs uppercase tracking-wide text-coffee-200">{relationLabel[edge.type]}</p>
              </div>
              <p className="text-xs text-slate-400">Land: {countryLabel[target.country]}</p>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                Melk: {selected.milk}% {'->'} {target.milk}% ({diffLabel(selected.milk, target.milk, '%')})
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                Sterkte: {selected.strength} {'->'} {target.strength} ({diffLabel(selected.strength, target.strength, '')})
              </div>
              <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                Volume: {selected.volume_ml} {'->'} {target.volume_ml}ml ({diffLabel(selected.volume_ml, target.volume_ml, 'ml')})
              </div>
            </div>
          </button>
        ))}

        {related.length === 0 && (
          <div className="rounded-lg bg-white/5 p-3 text-sm text-slate-300">Geen directe relaties in de huidige filtercontext.</div>
        )}
      </div>
    </div>
  )
}
