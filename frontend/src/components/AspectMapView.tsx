import { CoffeeNode, GraphEdge } from '../types/coffee'

interface AspectMapViewProps {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const countryFill: Record<string, string> = {
  italy: '#f4b183',
  spain: '#59b2ff',
}

export function AspectMapView({ nodes, edges, selectedId, onSelect }: AspectMapViewProps) {
  const width = 920
  const height = 560
  const leftPad = 70
  const rightPad = 36
  const topPad = 32
  const bottomPad = 56

  const xForMilk = (milk: number) => leftPad + (milk / 100) * (width - leftPad - rightPad)
  const yForStrength = (strength: number) =>
    topPad + ((5 - strength) / 4) * (height - topPad - bottomPad)
  const radiusForVolume = (volume: number) => 7 + ((volume - 20) / 280) * 13

  const byId = new Map(nodes.map((node) => [node.id, node]))

  const visibleEdges = edges
    .map((edge) => {
      const source = byId.get(edge.source)
      const target = byId.get(edge.target)
      if (!source || !target) {
        return null
      }
      return { edge, source, target }
    })
    .filter((item): item is { edge: GraphEdge; source: CoffeeNode; target: CoffeeNode } => Boolean(item))

  return (
    <div className="panel rounded-2xl p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[560px] w-full" role="img" aria-label="Aspect map">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        <line x1={leftPad} y1={height - bottomPad} x2={width - rightPad} y2={height - bottomPad} stroke="#64748b" />
        <line x1={leftPad} y1={topPad} x2={leftPad} y2={height - bottomPad} stroke="#64748b" />

        <text x={width / 2} y={height - 18} fill="#cbd5e1" fontSize="12" textAnchor="middle">
          Melkpercentage (0% - 100%)
        </text>
        <text x={20} y={height / 2} fill="#cbd5e1" fontSize="12" textAnchor="middle" transform={`rotate(-90 20 ${height / 2})`}>
          Sterkte (1 - 5)
        </text>

        {[1, 2, 3, 4, 5].map((level) => {
          const y = yForStrength(level)
          return (
            <g key={level}>
              <line x1={leftPad} y1={y} x2={width - rightPad} y2={y} stroke="#334155" strokeDasharray="4 4" />
              <text x={leftPad - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11">
                {level}
              </text>
            </g>
          )
        })}

        {visibleEdges.map(({ edge, source, target }) => {
          const selected = selectedId === source.id || selectedId === target.id
          return (
            <line
              key={edge.id}
              x1={xForMilk(source.milk)}
              y1={yForStrength(source.strength)}
              x2={xForMilk(target.milk)}
              y2={yForStrength(target.strength)}
              stroke={selected ? '#fcd9bc' : '#475569'}
              strokeWidth={selected ? 2.2 : 1.2}
              opacity={selectedId ? (selected ? 0.95 : 0.2) : 0.48}
            />
          )
        })}

        {nodes.map((node) => {
          const active = node.id === selectedId
          return (
            <g key={node.id} onClick={() => onSelect(node.id)} style={{ cursor: 'pointer' }}>
              <circle
                cx={xForMilk(node.milk)}
                cy={yForStrength(node.strength)}
                r={radiusForVolume(node.volume_ml)}
                fill={countryFill[node.country] ?? '#f4b183'}
                stroke={active ? '#ffffff' : '#0b0f14'}
                strokeWidth={active ? 3 : 2}
                opacity={selectedId ? (active ? 1 : 0.85) : 1}
              />
              <text
                x={xForMilk(node.milk)}
                y={yForStrength(node.strength) - radiusForVolume(node.volume_ml) - 8}
                textAnchor="middle"
                fill="#e2e8f0"
                fontSize="11"
              >
                {node.name}
              </text>
              <title>
                {node.name} - melk {node.milk}% - sterkte {node.strength} - volume {node.volume_ml}ml
              </title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
