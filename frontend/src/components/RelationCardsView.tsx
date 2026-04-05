import { CoffeeNode, GraphEdge, RelationType } from '../types/coffee'

interface RelationCardsViewProps {
  probant: CoffeeNode | null
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  onSelect: (id: string) => void
}

const relationLabel: Record<RelationType, string> = {
  variant_of: 'is een variant',
  similar_to: 'is vergelijkbaar',
  contains_milk: 'verschilt op melk',
  popular_in_country: 'is regionaal verwant',
}

const countryText: Record<string, string> = {
  italy: 'Italie',
  spain: 'Spanje',
}

function describeDifference(probant: CoffeeNode, related: CoffeeNode, relationType: RelationType) {
  const lines: string[] = []
  const details: string[] = []

  const strengthDiff = related.strength - probant.strength
  const volumeDiff = related.volume_ml - probant.volume_ml
  const milkDiff = related.milk - probant.milk

  if (relationType === 'similar_to') {
    lines.push('Koffie is vergelijkbaar.')
  } else if (relationType === 'variant_of') {
    lines.push('Dit is een variant op hetzelfde basisidee.')
  } else if (relationType === 'contains_milk') {
    lines.push('Het belangrijkste verschil zit in de melk.')
  } else {
    lines.push('De relatie zit vooral in gebruik en regionale stijl.')
  }

  if (strengthDiff !== 0) {
    if (Math.abs(strengthDiff) === 1) {
      details.push(strengthDiff > 0 ? 'iets sterker' : 'iets minder sterk')
    } else {
      details.push(strengthDiff > 0 ? 'duidelijk sterker' : 'duidelijk minder sterk')
    }
  }

  if (volumeDiff !== 0) {
    if (Math.abs(volumeDiff) <= 30) {
      details.push(volumeDiff > 0 ? 'een klein beetje groter' : 'een klein beetje kleiner')
    } else if (Math.abs(volumeDiff) <= 90) {
      details.push(volumeDiff > 0 ? 'merkbaar groter' : 'merkbaar kleiner')
    } else {
      details.push(volumeDiff > 0 ? 'veel groter' : 'veel kleiner')
    }
  }

  if (milkDiff !== 0) {
    if (Math.abs(milkDiff) <= 15) {
      details.push(milkDiff > 0 ? 'met een beetje melk erbij' : 'met iets minder melk')
    } else if (milkDiff > 0) {
      details.push('met duidelijk meer melk')
    } else {
      details.push('met duidelijk minder melk')
    }
  }

  if (details.length > 0) {
    lines.push(details.join(', '))
  }

  const region =
    probant.country === related.country
      ? `beide vooral in ${countryText[related.country]}`
      : `${countryText[probant.country]} vergeleken met ${countryText[related.country]}`

  lines.push(`Regionale context: ${region}`)
  return lines
}

export function RelationCardsView({ probant, nodes, edges, onSelect }: RelationCardsViewProps) {
  if (!probant) {
    return <div className="panel rounded-2xl p-4 text-sm text-slate-300">Kies eerst een probant.</div>
  }

  const nodeById = new Map(nodes.map((node) => [node.id, node]))
  const relationCards = edges
    .map((edge) => {
      if (edge.source !== probant.id && edge.target !== probant.id) {
        return null
      }

      const otherId = edge.source === probant.id ? edge.target : edge.source
      const other = nodeById.get(otherId)
      if (!other) {
        return null
      }

      return {
        edge,
        other,
        lines: describeDifference(probant, other, edge.type),
      }
    })
    .filter(
      (
        item,
      ): item is { edge: GraphEdge; other: CoffeeNode; lines: string[] } => Boolean(item),
    )

  return (
    <div className="space-y-3">
      <div className="panel rounded-2xl p-4">
        <p className="text-xs uppercase tracking-wide text-coffee-200">Centraal begrip</p>
        <h3 className="mt-1 font-display text-2xl text-white">{probant.name}</h3>
        <p className="mt-2 text-sm text-slate-300">
          Vanuit deze koffie tonen we alleen direct verbonden soorten, uitgelegd in mensentaal.
        </p>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {relationCards.map(({ edge, other, lines }) => (
          <button
            key={edge.id}
            onClick={() => onSelect(other.id)}
            className="panel rounded-2xl p-4 text-left transition hover:border-coffee-200/60 hover:bg-white/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg text-white">{other.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{relationLabel[edge.type]}</p>
              </div>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-300">
                {other.volume_ml} ml
              </span>
            </div>
            <div className="mt-3 space-y-1 text-sm leading-5 text-slate-200">
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}