import { useMemo } from 'react'
import { CoffeeNode, GraphEdge, RelationType } from '../types/coffee'

interface GraphProps {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  selectedId: string | null
  compareIds: string[]
  focusedId: string | null
  onSelect: (id: string, shift: boolean) => void
  onHover: (id: string | null) => void
}

const relationText: Record<RelationType, string> = {
  variant_of: 'variant',
  similar_to: 'vergelijkbaar',
  contains_milk: 'verschil in melk',
  popular_in_country: 'regionale link',
}

const countryText: Record<string, string> = {
  italy: 'Italie',
  spain: 'Spanje',
}

const nameForBubble = (name: string) => {
  if (name.length <= 14) {
    return name
  }
  return `${name.slice(0, 13)}...`
}

const compactLabelParts = (base: CoffeeNode, other: CoffeeNode, relation: RelationType) => {
  const detailParts: string[] = []

  const strengthDiff = other.strength - base.strength
  const volumeDiff = other.volume_ml - base.volume_ml
  const milkDiff = other.milk - base.milk

  if (strengthDiff !== 0) {
    detailParts.push(strengthDiff > 0 ? 'sterker' : 'minder sterk')
  }

  if (volumeDiff !== 0) {
    detailParts.push(volumeDiff > 0 ? 'groter' : 'kleiner')
  }

  if (milkDiff !== 0) {
    detailParts.push(milkDiff > 0 ? 'meer melk' : 'minder melk')
  }

  const line1 = relationText[relation]
  const line2 = detailParts.slice(0, 2).join(', ')
  return { line1, line2: line2 || 'directe relatie' }
}

const fillForNode = (node: CoffeeNode) => {
  if (node.country === 'italy') {
    return `hsl(26 95% ${58 - (node.strength - 1) * 6}%)`
  }
  return `hsl(207 92% ${58 - (node.strength - 1) * 6}%)`
}

const radiusForVolume = (volume: number) => 24 + ((volume - 20) / 280) * 30

export function Graph({
  nodes,
  edges,
  selectedId,
  compareIds,
  focusedId,
  onSelect,
  onHover,
}: GraphProps) {
  const width = 920
  const height = 560
  const cx = width / 2
  const cy = height / 2

  const centerNode =
    nodes.find((node) => node.id === selectedId) ??
    nodes.find((node) => node.id === 'espresso') ??
    nodes[0] ??
    null

  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes])

  const directItems = useMemo(() => {
    if (!centerNode) {
      return []
    }

    const mapped = edges
      .map((edge) => {
        if (edge.source !== centerNode.id && edge.target !== centerNode.id) {
          return null
        }

        const otherId = edge.source === centerNode.id ? edge.target : edge.source
        const other = nodeById.get(otherId)
        if (!other) {
          return null
        }

        return {
          edge,
          other,
          label: compactLabelParts(centerNode, other, edge.type),
        }
      })
      .filter(
        (
          item,
        ): item is {
          edge: GraphEdge
          other: CoffeeNode
          label: { line1: string; line2: string }
        } => Boolean(item),
      )

    return mapped.sort((a, b) => a.other.name.localeCompare(b.other.name))
  }, [centerNode, edges, nodeById])

  const positionedItems = useMemo(() => {
    if (directItems.length === 0) {
      return []
    }

    const ring = Math.min(width, height) * 0.34

    return directItems.map((item, index) => {
      const angle = (-Math.PI / 2) + (index * (Math.PI * 2)) / directItems.length
      const x = cx + Math.cos(angle) * ring
      const y = cy + Math.sin(angle) * ring
      const lx = cx + Math.cos(angle) * (ring * 0.58)
      const ly = cy + Math.sin(angle) * (ring * 0.58)
      return {
        ...item,
        x,
        y,
        lx,
        ly,
      }
    })
  }, [directItems])

  const hasCenter = Boolean(centerNode)

  return (
    <div className="panel relative h-[560px] w-full overflow-hidden rounded-2xl p-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label="Schema met directe relaties">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {positionedItems.map((item) => {
          const active = focusedId ? item.other.id === focusedId || centerNode?.id === focusedId : true
          return (
            <g key={item.edge.id} opacity={active ? 1 : 0.3}>
              <line x1={cx} y1={cy} x2={item.x} y2={item.y} stroke="#64748b" strokeWidth="2" />
              <text
                x={item.lx}
                y={item.ly}
                fill="#dbe4ef"
                fontSize="10"
                textAnchor="middle"
                style={{ paintOrder: 'stroke', stroke: '#020617', strokeWidth: 3 }}
              >
                <tspan x={item.lx} dy="0">{item.label.line1}</tspan>
                <tspan x={item.lx} dy="12">{item.label.line2}</tspan>
              </text>
            </g>
          )
        })}

        {hasCenter && centerNode && (
          <g
            transform={`translate(${cx}, ${cy})`}
            onMouseEnter={() => onHover(centerNode.id)}
            onMouseLeave={() => onHover(null)}
            onClick={(event) => onSelect(centerNode.id, event.shiftKey)}
            style={{ cursor: 'pointer' }}
          >
            <circle
              r={radiusForVolume(centerNode.volume_ml)}
              fill={fillForNode(centerNode)}
              stroke="#f8fafc"
              strokeWidth={3}
            />
            <text
              textAnchor="middle"
              dy=".35em"
              fill="#f8fafc"
              fontSize="11"
              fontWeight={800}
            >
              {nameForBubble(centerNode.name)}
            </text>
          </g>
        )}

        {positionedItems.map((item) => {
          const active = selectedId === item.other.id
          const compared = compareIds.includes(item.other.id)
          const focusDim = focusedId ? item.other.id !== focusedId && centerNode?.id !== focusedId : false

          return (
            <g
              key={item.other.id}
              transform={`translate(${item.x}, ${item.y})`}
              opacity={focusDim ? 0.35 : 1}
              onMouseEnter={() => onHover(item.other.id)}
              onMouseLeave={() => onHover(null)}
              onClick={(event) => onSelect(item.other.id, event.shiftKey)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                r={radiusForVolume(item.other.volume_ml)}
                fill={fillForNode(item.other)}
                stroke={active ? '#f8fafc' : compared ? '#34d399' : '#0b0f14'}
                strokeWidth={active ? 3.5 : compared ? 3 : 2}
              />
              <text
                textAnchor="middle"
                dy=".35em"
                fill="#f8fafc"
                fontSize={active ? 11 : 10}
                fontWeight={800}
              >
                {nameForBubble(item.other.name)}
              </text>
              <title>
                {item.other.name} · {countryText[item.other.country]} · sterkte {item.other.strength} · {item.other.volume_ml}ml
              </title>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
