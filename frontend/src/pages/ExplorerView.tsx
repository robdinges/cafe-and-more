import { useEffect, useMemo } from 'react'
import { DetailPanel } from '../components/DetailPanel'
import { Graph } from '../components/Graph'
import { Sidebar } from '../components/Sidebar'
import { getCoffees, getFilteredGraph } from '../data/api'
import { useCoffeeStore } from '../store/useCoffeeStore'
import { CountryId } from '../types/coffee'

export function ExplorerView() {
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
  const setFocusedNodeId = useCoffeeStore((state) => state.setFocusedNodeId)
  const toggleCompareId = useCoffeeStore((state) => state.toggleCompareId)
  const setLoading = useCoffeeStore((state) => state.setLoading)

  useEffect(() => {
    void getCoffees().then((graph) => {
      initialize(graph.nodes, graph.edges)
    })
  }, [initialize])

  useEffect(() => {
    setLoading(true)
    const timeout = window.setTimeout(() => {
      void getFilteredGraph(filters).then((payload) => {
        setFilteredNodeIds(payload.nodes)
        initialize(nodes, payload.edges)
        if (!payload.nodes.includes(selectedNodeId ?? '')) {
          setSelectedNodeId(payload.nodes[0] ?? null)
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

  const selected = useMemo(
    () => filteredNodes.find((node) => node.id === selectedNodeId) ?? null,
    [filteredNodes, selectedNodeId],
  )

  const related = useMemo(() => {
    if (!selected) {
      return []
    }

    const relatedIds = new Set(selected.relations.map((relation) => relation.target))
    return filteredNodes.filter((node) => relatedIds.has(node.id))
  }, [filteredNodes, selected])

  const handleCountryToggle = (country: CountryId) => {
    if (filters.countries.includes(country)) {
      const next = filters.countries.filter((value) => value !== country)
      setCountries(next.length > 0 ? next : [country])
      return
    }

    setCountries([...filters.countries, country])
  }

  return (
    <div className="space-y-4">
      <section className="panel rounded-2xl p-3">
        <input
          type="search"
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          placeholder="Search coffee types..."
          className="w-full rounded-xl border border-white/10 bg-night-800/80 px-4 py-3 text-sm text-white outline-none transition focus:border-coffee-200"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <Sidebar
          filters={filters}
          onCountryToggle={handleCountryToggle}
          onMilkLevelChange={(milkLevel) => setFilters({ milkLevel })}
          onStrengthRangeChange={(strength) => setFilters({ strength })}
          onVolumeRangeChange={(volume) => setFilters({ volume })}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
            <span>{filteredNodes.length} coffees visible</span>
            <span>{loading ? 'Updating graph...' : 'Live graph ready'}</span>
          </div>
          <Graph
            nodes={filteredNodes}
            edges={filteredEdges}
            selectedId={selectedNodeId}
            compareIds={compareIds}
            focusedId={focusedNodeId}
            onSelect={(id, shift) => {
              if (shift) {
                toggleCompareId(id)
                return
              }
              setSelectedNodeId(id)
            }}
            onHover={(id) => setHoveredNodeId(id)}
          />
        </div>

        <DetailPanel
          node={selected}
          related={related}
          compareIds={compareIds}
          onCompare={(id) => toggleCompareId(id)}
          onFocus={(id) => setFocusedNodeId(focusedNodeId === id ? null : id)}
        />
      </section>
    </div>
  )
}
