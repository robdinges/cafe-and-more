import { useMemo } from 'react'
import { CoffeeNode, GraphEdge, RelationType } from '../types/coffee'

interface GraphProps {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  selectedId: string | null
  compareIds: string[]
  focusedId: string | null
  milkVisualMode: 'pie' | 'level'
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
  france: 'Frankrijk',
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

const coffeeLiquidForNode = (node: CoffeeNode) => (node.country === 'italy' ? '#5b2f12' : '#3b2a1a')

const initialsForAvatar = (name: string) => {
  const words = name
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean)

  if (words.length === 0) {
    return '?'
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

const avatarSvgDataUri = (node: CoffeeNode) => {
  const label = initialsForAvatar(node.name)
  const bg = node.country === 'italy' ? '#b45309' : '#0369a1'
  const rim = node.country === 'italy' ? '#f59e0b' : '#38bdf8'
  const cup = '#f8fafc'
  const coffee = node.milk > 45 ? '#e2e8f0' : '#5b2f12'

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
    <rect width='64' height='64' rx='14' fill='${bg}'/>
    <circle cx='32' cy='32' r='23' fill='none' stroke='${rim}' stroke-width='2'/>
    <rect x='17' y='28' width='28' height='16' rx='4' fill='${cup}'/>
    <path d='M45 31h4a4 4 0 1 1 0 8h-4' fill='none' stroke='${cup}' stroke-width='3' stroke-linecap='round'/>
    <rect x='20' y='30.5' width='22' height='5.5' rx='2.5' fill='${coffee}'/>
    <text x='32' y='53' text-anchor='middle' font-family='ui-sans-serif,Segoe UI,Arial' font-size='10' font-weight='700' fill='#ffffff'>${label}</text>
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const pieSlicePath = (radius: number, percent: number) => {
  if (percent <= 0) {
    return null
  }

  if (percent >= 100) {
    return null
  }

  const startAngle = -Math.PI / 2
  const endAngle = startAngle + (Math.PI * 2 * percent) / 100
  const x1 = Math.cos(startAngle) * radius
  const y1 = Math.sin(startAngle) * radius
  const x2 = Math.cos(endAngle) * radius
  const y2 = Math.sin(endAngle) * radius
  const largeArcFlag = percent > 50 ? 1 : 0

  return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

export function Graph({
  nodes,
  edges,
  selectedId,
  compareIds,
  focusedId,
  milkVisualMode,
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

  const renderNodeBubble = (node: CoffeeNode, isActive: boolean, isCompared: boolean) => {
    const outerRadius = radiusForVolume(node.volume_ml)
    const innerRadius = Math.max(outerRadius - 6, 10)
    const avatarRadius = Math.max(innerRadius * 0.42, 10)
    const milkPercent = Math.min(Math.max(node.milk, 0), 100)
    const clipId = `clip-${node.id}`
    const avatarClipId = `avatar-clip-${node.id}`
    const coffeeColor = coffeeLiquidForNode(node)
    const slice = pieSlicePath(innerRadius, milkPercent)
    const milkHeight = (innerRadius * 2 * milkPercent) / 100
    const milkTopY = innerRadius - milkHeight
    const avatarHref = avatarSvgDataUri(node)

    return (
      <>
        <defs>
          <clipPath id={clipId}>
            <circle r={innerRadius} />
          </clipPath>
          <clipPath id={avatarClipId}>
            <circle r={avatarRadius} />
          </clipPath>
        </defs>

        <circle
          r={outerRadius}
          fill={fillForNode(node)}
          stroke={isActive ? '#f8fafc' : isCompared ? '#34d399' : '#0b0f14'}
          strokeWidth={isActive ? 3.5 : isCompared ? 3 : 2}
        />

        <circle r={innerRadius} fill={coffeeColor} opacity={0.95} />

        {milkVisualMode === 'pie' ? (
          milkPercent >= 100 ? (
            <circle r={innerRadius} fill="#f8fafc" opacity={0.9} />
          ) : (
            slice && <path d={slice} fill="#f8fafc" opacity={0.9} />
          )
        ) : (
          <rect
            x={-innerRadius}
            y={milkTopY}
            width={innerRadius * 2}
            height={milkHeight}
            fill="#f8fafc"
            opacity={0.9}
            clipPath={`url(#${clipId})`}
          />
        )}

        <circle r={avatarRadius} fill="#0f172a" stroke="#f8fafc" strokeWidth={2} opacity={0.95} />
        <image
          href={avatarHref}
          x={-avatarRadius}
          y={-avatarRadius}
          width={avatarRadius * 2}
          height={avatarRadius * 2}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${avatarClipId})`}
        />
        <text textAnchor="middle" dy=".35em" fill="#f8fafc" fontSize={Math.max(avatarRadius * 0.46, 8)} fontWeight={700} opacity={0}>
          {initialsForAvatar(node.name)}
        </text>
      </>
    )
  }

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
            {renderNodeBubble(centerNode, true, compareIds.includes(centerNode.id))}
            <text textAnchor="middle" y={radiusForVolume(centerNode.volume_ml) + 16} fill="#f8fafc" fontSize="11" fontWeight={800}>
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
              {renderNodeBubble(item.other, active, compared)}
              <text
                textAnchor="middle"
                y={radiusForVolume(item.other.volume_ml) + 15}
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
