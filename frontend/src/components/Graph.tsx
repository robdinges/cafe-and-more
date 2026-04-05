import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CoffeeNode, GraphEdge } from '../types/coffee'

interface GraphProps {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  selectedId: string | null
  compareIds: string[]
  focusedId: string | null
  onSelect: (id: string, shift: boolean) => void
  onHover: (id: string | null) => void
}

type SimNode = CoffeeNode & d3.SimulationNodeDatum

type SimEdge = GraphEdge & {
  source: SimNode
  target: SimNode
}

const countryColor: Record<string, string> = {
  italy: '#f4b183',
  spain: '#59b2ff',
}

const countryX: Record<string, number> = {
  italy: 0.34,
  spain: 0.66,
}

const edgeStroke: Record<GraphEdge['type'], string> = {
  variant_of: '#e2ab86',
  similar_to: '#94a3b8',
  contains_milk: '#f9d38b',
  popular_in_country: '#64748b',
}

export function Graph({
  nodes,
  edges,
  selectedId,
  compareIds,
  focusedId,
  onSelect,
  onHover,
}: GraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const simulationRef = useRef<d3.Simulation<SimNode, SimEdge> | null>(null)
  const positionsRef = useRef<Map<string, { x: number; y: number }>>(new Map())
  const zoomLevelRef = useRef(1)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [tooltip, setTooltip] = useState<{
    x: number
    y: number
    name: string
    country: string
  } | null>(null)

  const radiusScale = useMemo(() => {
    const popularity = nodes.map((n) => n.popularity)
    return d3
      .scaleSqrt()
      .domain([Math.min(...popularity, 20), Math.max(...popularity, 100)])
      .range([10, 28])
  }, [nodes])

  useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
    const width = svgRef.current.clientWidth ?? 840
    const height = svgRef.current.clientHeight ?? 580

    svg.selectAll('*').remove()

    const root = svg.append('g').attr('class', 'graph-root')
    const linkLayer = root.append('g').attr('class', 'link-layer')
    const nodeLayer = root.append('g').attr('class', 'node-layer')
    const labelLayer = root.append('g').attr('class', 'label-layer')

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.55, 3.2])
      .on('zoom', (event) => {
        root.attr('transform', event.transform.toString())
        zoomLevelRef.current = event.transform.k
        setZoomLevel(event.transform.k)
        labelLayer
          .selectAll<SVGTextElement, SimNode>('text')
          .attr('opacity', zoomLevelRef.current > 1.2 ? 0.9 : 0)
      })

    svg.call(zoom)

    const simNodes: SimNode[] = nodes.map((node) => {
      const previous = positionsRef.current.get(node.id)
      return {
        ...node,
        x: previous?.x ?? width * (countryX[node.country] ?? 0.5),
        y: previous?.y ?? height * 0.48 + (Math.random() * 24 - 12),
      }
    })

    const idToNode = new Map(simNodes.map((node) => [node.id, node]))

    const simEdges = edges
      .map((edge) => {
        const source = idToNode.get(edge.source)
        const target = idToNode.get(edge.target)
        if (!source || !target) {
          return null
        }

        return {
          ...edge,
          source,
          target,
        }
      })
      .filter((edge): edge is SimEdge => Boolean(edge))

    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimEdge>(simEdges)
          .id((d) => d.id)
          .distance((edge) => {
            if (edge.type === 'variant_of') {
              return 84
            }
            if (edge.type === 'contains_milk') {
              return 96
            }
            return 110
          })
          .strength(0.32),
      )
      .force('charge', d3.forceManyBody().strength(-145))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'countryX',
        d3
          .forceX<SimNode>((d) => width * (countryX[d.country] ?? 0.5))
          .strength(0.24),
      )
      .force('countryY', d3.forceY<SimNode>(height / 2).strength(0.08))
      .force('collision', d3.forceCollide<SimNode>((d) => radiusScale(d.popularity) + 5))
      .alpha(0.95)
      .alphaDecay(0.035)

    simulationRef.current = simulation

    const linkSelection = linkLayer
      .selectAll<SVGLineElement, SimEdge>('line')
      .data(simEdges, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('line')
            .attr('stroke', (d) => edgeStroke[d.type] ?? '#94a3b8')
            .attr('stroke-width', 1.8)
            .attr('stroke-opacity', 0)
            .call((selection) =>
              selection.transition().duration(380).attr('stroke-opacity', (d) =>
                focusedId ? (d.source.id === focusedId || d.target.id === focusedId ? 0.85 : 0.14) : 0.42,
              ),
            ),
        (update) =>
          update.call((selection) =>
            selection
              .transition()
              .duration(280)
              .attr('stroke-opacity', (d) =>
                focusedId ? (d.source.id === focusedId || d.target.id === focusedId ? 0.85 : 0.14) : 0.42,
              ),
          ),
        (exit) => exit.call((selection) => selection.transition().duration(240).attr('stroke-opacity', 0).remove()),
      )

    const nodeSelection = nodeLayer
      .selectAll<SVGCircleElement, SimNode>('circle')
      .data(simNodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('r', 0)
            .attr('fill', (d) => countryColor[d.country] ?? '#f4b183')
            .attr('stroke', '#0b0f14')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call((selection) =>
              selection
                .transition()
                .duration(340)
                .attr('r', (d) => radiusScale(d.popularity)),
            ),
        (update) =>
          update.call((selection) =>
            selection
              .transition()
              .duration(280)
              .attr('r', (d) => radiusScale(d.popularity)),
          ),
        (exit) => exit.call((selection) => selection.transition().duration(220).attr('r', 0).remove()),
      )

    const labelSelection = labelLayer
      .selectAll<SVGTextElement, SimNode>('text')
      .data(simNodes, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('text')
            .text((d) => d.name)
            .attr('font-size', 11)
            .attr('font-family', 'Manrope')
            .attr('fill', '#dbe4ef')
            .attr('text-anchor', 'middle')
            .attr('dy', (d) => radiusScale(d.popularity) + 12)
            .attr('opacity', zoomLevelRef.current > 1.2 ? 0.9 : 0)
            .attr('pointer-events', 'none'),
          (update) => update.attr('opacity', zoomLevelRef.current > 1.2 ? 0.9 : 0),
        (exit) => exit.remove(),
      )

    nodeSelection
      .on('mouseover', (event, node) => {
        onHover(node.id)
        setTooltip({
          x: event.offsetX + 14,
          y: event.offsetY + 14,
          name: node.name,
          country: node.country,
        })
      })
      .on('mousemove', (event, node) => {
        setTooltip({
          x: event.offsetX + 14,
          y: event.offsetY + 14,
          name: node.name,
          country: node.country,
        })
      })
      .on('mouseout', () => {
        onHover(null)
        setTooltip(null)
      })
      .on('click', (event, node) => {
        onSelect(node.id, event.shiftKey)
      })

    nodeSelection.call(
      d3
        .drag<SVGCircleElement, SimNode>()
        .on('start', (event, node) => {
          if (!event.active) {
            simulation.alphaTarget(0.2).restart()
          }
          node.fx = node.x
          node.fy = node.y
        })
        .on('drag', (event, node) => {
          node.fx = event.x
          node.fy = event.y
        })
        .on('end', (event, node) => {
          if (!event.active) {
            simulation.alphaTarget(0)
          }
          node.fx = null
          node.fy = null
        }),
    )

    simulation.on('tick', () => {
      linkSelection
        .attr('x1', (d) => d.source.x ?? 0)
        .attr('y1', (d) => d.source.y ?? 0)
        .attr('x2', (d) => d.target.x ?? 0)
        .attr('y2', (d) => d.target.y ?? 0)

      nodeSelection
        .attr('cx', (d) => d.x ?? 0)
        .attr('cy', (d) => d.y ?? 0)
        .attr('stroke-width', (d) => {
          if (selectedId === d.id) {
            return 3.5
          }
          if (compareIds.includes(d.id)) {
            return 3
          }
          return 2
        })
        .attr('stroke', (d) => {
          if (selectedId === d.id) {
            return '#fde9d8'
          }
          if (compareIds.includes(d.id)) {
            return '#34d399'
          }
          return '#0b0f14'
        })
        .attr('opacity', (d) => {
          if (!focusedId) {
            return 1
          }

          if (d.id === focusedId) {
            return 1
          }

          const hasFocusedEdge = simEdges.some(
            (edge) =>
              (edge.source.id === focusedId && edge.target.id === d.id) ||
              (edge.target.id === focusedId && edge.source.id === d.id),
          )

          return hasFocusedEdge ? 0.9 : 0.22
        })

      labelSelection
        .attr('x', (d) => d.x ?? 0)
        .attr('y', (d) => d.y ?? 0)
        .attr('dy', (d) => radiusScale(d.popularity) + 12)
        .attr('opacity', zoomLevelRef.current > 1.2 ? 0.9 : 0)

      for (const node of simNodes) {
        positionsRef.current.set(node.id, {
          x: node.x ?? width / 2,
          y: node.y ?? height / 2,
        })
      }
    })

    simulation.alphaTarget(0.16).restart()
    const coolDown = window.setTimeout(() => simulation.alphaTarget(0), 360)

    return () => {
      window.clearTimeout(coolDown)
      simulation.stop()
    }
  }, [nodes, edges, selectedId, compareIds, focusedId, onSelect, onHover, radiusScale])

  return (
    <div className="panel relative h-[560px] w-full overflow-hidden rounded-2xl">
      <svg ref={svgRef} className="h-full w-full" role="img" aria-label="Coffee relationship graph" />
      {tooltip && (
        <div
          className="pointer-events-none absolute rounded-md border border-white/10 bg-night-800/95 px-3 py-2 text-xs text-slate-100"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="font-semibold text-white">{tooltip.name}</p>
          <p className="uppercase tracking-wide text-coffee-200">{tooltip.country}</p>
        </div>
      )}
      <div className="absolute bottom-3 left-3 rounded-full bg-black/40 px-3 py-1 text-xs text-slate-200">
        Zoom: {zoomLevel.toFixed(2)}x
      </div>
    </div>
  )
}
