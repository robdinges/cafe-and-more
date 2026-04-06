import { useEffect, useMemo, useState } from 'react'
import { DetailPanel } from '../components/DetailPanel'
import { Graph } from '../components/Graph'
import { RelationCardsView } from '../components/RelationCardsView'
import { Sidebar } from '../components/Sidebar'
import { getCoffees, getFilteredGraph } from '../data/api'
import { useCoffeeStore } from '../store/useCoffeeStore'
import { CountryId, RelationType } from '../types/coffee'

const relationLabel: Record<RelationType, string> = {
  variant_of: 'variant',
  similar_to: 'vergelijkbaar',
  contains_milk: 'verschil in melk',
  popular_in_country: 'regionale link',
}

const countryLabel: Record<CountryId, string> = {
  italy: 'Italie',
  spain: 'Spanje',
  france: 'Frankrijk',
}

export function ExplorerView() {
  const [probantSearch, setProbantSearch] = useState('Espresso')
  const [viewMode, setViewMode] = useState<'cards' | 'graph'>('cards')
  const [milkVisualMode, setMilkVisualMode] = useState<'pie' | 'level'>('pie')

  const nodes = useCoffeeStore((state) => state.nodes)
  const edges = useCoffeeStore((state) => state.edges)
  const filters = useCoffeeStore((state) => state.filters)
  const selectedNodeId = useCoffeeStore((state) => state.selectedNodeId)
  const compareIds = useCoffeeStore((state) => state.compareIds)
  const focusedNodeId = useCoffeeStore((state) => state.focusedNodeId)
  const filteredNodeIds = useCoffeeStore((state) => state.filteredNodeIds)
  const loading = useCoffeeStore((state) => state.loading)

  const initialize = useCoffeeStore((state) => state.initialize)
  const setFilteredNodeIds = useCoffeeStore((state) => state.setFilteredNodeIds)
  const setSelectedNodeId = useCoffeeStore((state) => state.setSelectedNodeId)
  const setFilters = useCoffeeStore((state) => state.setFilters)
  const setCountries = useCoffeeStore((state) => state.setCountries)
  const setHoveredNodeId = useCoffeeStore((state) => state.setHoveredNodeId)
  const toggleCompareId = useCoffeeStore((state) => state.toggleCompareId)
  const setLoading = useCoffeeStore((state) => state.setLoading)

  useEffect(() => {
    void getCoffees().then((graph) => {
      initialize(graph.nodes, graph.edges)
      const espresso = graph.nodes.find((node) => node.id === 'espresso')
      if (espresso) {
        setSelectedNodeId(espresso.id)
      }
    })
  }, [initialize, setSelectedNodeId])

  useEffect(() => {
    setLoading(true)
    const timeout = window.setTimeout(() => {
      void getFilteredGraph(filters).then((payload) => {
        setFilteredNodeIds(payload.nodes)
        initialize(nodes, payload.edges)
        if (!payload.nodes.includes(selectedNodeId ?? '')) {
          const espresso = payload.nodes.find((id) => id === 'espresso')
          setSelectedNodeId(espresso ?? payload.nodes[0] ?? null)
        }
        setLoading(false)
      })
    }, 130)

    return () => window.clearTimeout(timeout)
  }, [
    filters,
    initialize,
    nodes,
    selectedNodeId,
    setFilteredNodeIds,
    setLoading,
    setSelectedNodeId,
  ])

  const filteredNodes = useMemo(
    () => nodes.filter((node) => filteredNodeIds.includes(node.id)),
    [filteredNodeIds, nodes],
  )

  const filteredEdges = useMemo(
    () => edges.filter((edge) => filteredNodeIds.includes(edge.source) && filteredNodeIds.includes(edge.target)),
    [edges, filteredNodeIds],
  )

  const directEdges = useMemo(() => {
    if (!selectedNodeId) {
      return []
    }
    return filteredEdges.filter(
      (edge) => edge.source === selectedNodeId || edge.target === selectedNodeId,
    )
  }, [filteredEdges, selectedNodeId])

  const directNodeIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set<string>()
    }

    const ids = new Set<string>([selectedNodeId])
    for (const edge of directEdges) {
      ids.add(edge.source)
      ids.add(edge.target)
    }
    return ids
  }, [directEdges, selectedNodeId])

  const graphNodes = useMemo(
    () => filteredNodes.filter((node) => directNodeIds.has(node.id)),
    [directNodeIds, filteredNodes],
  )

  const selected = useMemo(
    () => graphNodes.find((node) => node.id === selectedNodeId) ?? null,
    [graphNodes, selectedNodeId],
  )

  const related = useMemo(() => {
    if (!selected) {
      return []
    }

    const relatedIds = new Set(selected.relations.map((relation) => relation.target))
    return graphNodes.filter((node) => relatedIds.has(node.id))
  }, [graphNodes, selected])

  useEffect(() => {
    if (selected) {
      setProbantSearch(selected.name)
    }
  }, [selected])

  const handleCountryToggle = (country: CountryId) => {
    if (filters.countries.includes(country)) {
      const next = filters.countries.filter((value) => value !== country)
      setCountries(next.length > 0 ? next : [country])
      return
    }

    setCountries([...filters.countries, country])
  }

  const chooseProbantFromSearch = (input: string) => {
    const query = input.trim().toLowerCase()
    if (!query) {
      return
    }

    const match =
      filteredNodes.find((node) => node.name.toLowerCase() === query) ??
      filteredNodes.find((node) => node.name.toLowerCase().includes(query))

    if (match) {
      setSelectedNodeId(match.id)
      setProbantSearch(match.name)
    }
  }

  const suggestions = useMemo(() => {
    const query = probantSearch.trim().toLowerCase()
    const relationByNode = new Map<string, string>()

    for (const edge of directEdges) {
      const target = edge.source === selectedNodeId ? edge.target : edge.source
      relationByNode.set(target, relationLabel[edge.type])
    }

    if (!query) {
      return filteredNodes.slice(0, 6).map((node) => ({
        ...node,
        relationHint: relationByNode.get(node.id) ?? null,
      }))
    }

    return filteredNodes
      .filter((node) => node.name.toLowerCase().includes(query))
      .slice(0, 6)
      .map((node) => ({
        ...node,
        relationHint: relationByNode.get(node.id) ?? null,
      }))
  }, [directEdges, filteredNodes, probantSearch, selectedNodeId])

  return (
    <div className="space-y-4">
      <section className="panel rounded-2xl p-3">
        <div className="relative flex flex-wrap items-center gap-2">
          <label htmlFor="probant-search" className="text-xs uppercase tracking-wide text-slate-400">
            Kies probant
          </label>
          <input
            id="probant-search"
            type="search"
            value={probantSearch}
            onChange={(event) => setProbantSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                chooseProbantFromSearch(probantSearch)
              }
            }}
            placeholder="Bijv. Espresso"
            className="flex-1 rounded-xl border border-white/10 bg-night-800/80 px-4 py-3 text-sm text-white outline-none transition focus:border-coffee-200"
          />
          <button
            onClick={() => chooseProbantFromSearch(probantSearch)}
            className="rounded-lg bg-coffee-400 px-3 py-2 text-sm font-semibold text-night-950 transition hover:bg-coffee-200"
          >
            Toon relaties
          </button>

          {suggestions.length > 0 && (
            <div className="absolute left-24 right-24 top-[4.35rem] z-20 rounded-xl border border-white/10 bg-night-900/95 p-2 shadow-2xl backdrop-blur-sm">
              <div className="grid gap-1">
                {suggestions.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => chooseProbantFromSearch(node.name)}
                    className="rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
                  >
                    <div className="font-medium text-white">{node.name}</div>
                    <div className="text-xs text-slate-400">
                      {countryLabel[node.country]} · sterkte {node.strength} · melk {node.milk}% · {node.volume_ml}ml
                    </div>
                    {node.relationHint && (
                      <div className="mt-1 text-[11px] text-coffee-200">Directe verbinding: {node.relationHint}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <Sidebar
          filters={filters}
          onCountryToggle={handleCountryToggle}
          onMilkRangeChange={(milkRange) => setFilters({ milkRange })}
          onStrengthRangeChange={(strength) => setFilters({ strength })}
          onVolumeRangeChange={(volume) => setFilters({ volume })}
        />

        <div className="space-y-2">
          <div className="panel flex flex-wrap items-center justify-between gap-2 rounded-xl p-2 text-xs uppercase tracking-wide text-slate-400">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewMode('cards')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'cards'
                    ? 'bg-coffee-400 text-night-950'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Relaties in taal
              </button>
              <button
                onClick={() => setViewMode('graph')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === 'graph'
                    ? 'bg-coffee-400 text-night-950'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                Schema
              </button>
              {viewMode === 'graph' && (
                <>
                  <span className="ml-2 text-[11px] text-slate-500">Node-vulling</span>
                  <button
                    onClick={() => setMilkVisualMode('pie')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      milkVisualMode === 'pie'
                        ? 'bg-coffee-400 text-night-950'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    Pie
                  </button>
                  <button
                    onClick={() => setMilkVisualMode('level')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      milkVisualMode === 'level'
                        ? 'bg-coffee-400 text-night-950'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    Niveau
                  </button>
                </>
              )}
            </div>
            <div>
              <span>{graphNodes.length} directe relaties zichtbaar</span>
              <span className="ml-3">{loading ? 'Verversen...' : 'Actueel'}</span>
            </div>
          </div>
          {viewMode === 'cards' ? (
            <RelationCardsView
              probant={selected}
              nodes={graphNodes}
              edges={directEdges}
              onSelect={(id) => setSelectedNodeId(id)}
            />
          ) : (
            <Graph
              nodes={graphNodes}
              edges={directEdges}
              selectedId={selectedNodeId}
              compareIds={compareIds}
              focusedId={focusedNodeId}
              milkVisualMode={milkVisualMode}
              onSelect={(id, shift) => {
                if (shift) {
                  toggleCompareId(id)
                  return
                }
                setSelectedNodeId(id)
              }}
              onHover={(id) => setHoveredNodeId(id)}
            />
          )}
        </div>

        <DetailPanel
          node={selected}
          related={related}
        />
      </section>
    </div>
  )
}
