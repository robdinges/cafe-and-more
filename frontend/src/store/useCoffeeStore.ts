import { create } from 'zustand'
import { coffeeNodes } from '../data/coffees'
import { CoffeeNode, CompareMetrics, CountryId, FilterState, GraphEdge } from '../types/coffee'

const defaultFilters: FilterState = {
  countries: ['italy', 'spain', 'france'],
  milkRange: [0, 100],
  strength: [1, 5],
  volume: [20, 280],
  search: '',
}

interface CoffeeStoreState {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
  filteredNodeIds: string[]
  selectedNodeId: string | null
  hoveredNodeId: string | null
  focusedNodeId: string | null
  compareIds: string[]
  compareMetrics: CompareMetrics[]
  loading: boolean
  filters: FilterState
  initialize: (nodes: CoffeeNode[], edges: GraphEdge[]) => void
  setFilteredNodeIds: (ids: string[]) => void
  setFilters: (partial: Partial<FilterState>) => void
  setCountries: (countries: CountryId[]) => void
  setSelectedNodeId: (id: string | null) => void
  setHoveredNodeId: (id: string | null) => void
  setFocusedNodeId: (id: string | null) => void
  toggleCompareId: (id: string) => void
  clearCompare: () => void
  setCompareMetrics: (metrics: CompareMetrics[]) => void
  setLoading: (value: boolean) => void
}

export const useCoffeeStore = create<CoffeeStoreState>((set, get) => ({
  nodes: coffeeNodes,
  edges: [],
  filteredNodeIds: coffeeNodes.map((node) => node.id),
  selectedNodeId: null,
  hoveredNodeId: null,
  focusedNodeId: null,
  compareIds: [],
  compareMetrics: [],
  loading: false,
  filters: defaultFilters,
  initialize: (nodes, edges) =>
    set((state) => ({
      nodes,
      edges,
      filteredNodeIds:
        state.filteredNodeIds.length > 0 ? state.filteredNodeIds : nodes.map((node) => node.id),
      selectedNodeId: state.selectedNodeId ?? nodes[0]?.id ?? null,
    })),
  setFilteredNodeIds: (ids) => set({ filteredNodeIds: ids }),
  setFilters: (partial) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...partial,
      },
    })),
  setCountries: (countries) =>
    set((state) => ({
      filters: {
        ...state.filters,
        countries,
      },
    })),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setHoveredNodeId: (id) => set({ hoveredNodeId: id }),
  setFocusedNodeId: (id) => set({ focusedNodeId: id }),
  toggleCompareId: (id) => {
    const compareIds = get().compareIds
    if (compareIds.includes(id)) {
      set({ compareIds: compareIds.filter((item) => item !== id) })
      return
    }

    const next = [...compareIds, id]
    set({ compareIds: next.slice(-3) })
  },
  clearCompare: () => set({ compareIds: [], compareMetrics: [] }),
  setCompareMetrics: (metrics) => set({ compareMetrics: metrics }),
  setLoading: (value) => set({ loading: value }),
}))
