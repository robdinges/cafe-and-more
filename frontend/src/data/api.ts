import { buildEdges, graphPayload } from './coffees'
import { CompareMetrics, FilterState, GraphPayload } from '../types/coffee'

const API_BASE = 'http://localhost:8000/api'

interface FilterResponse {
  nodes: string[]
  edges: GraphPayload['edges']
}

interface CompareResponse {
  items: CompareMetrics[]
}

const milkRangeForLevel = (milkLevel: FilterState['milkLevel']): [number, number] => {
  if (milkLevel === 'none') {
    return [0, 0]
  }
  if (milkLevel === 'little') {
    return [1, 40]
  }
  if (milkLevel === 'much') {
    return [41, 100]
  }
  return [0, 100]
}

const fallbackFilter = (filters: FilterState): FilterResponse => {
  const search = filters.search.trim().toLowerCase()
  const [minMilk, maxMilk] = milkRangeForLevel(filters.milkLevel)

  const nodes = graphPayload.nodes.filter((coffee) => {
    const matchCountry = filters.countries.includes(coffee.country)
    const matchStrength =
      coffee.strength >= filters.strength[0] && coffee.strength <= filters.strength[1]
    const matchVolume =
      coffee.volume_ml >= filters.volume[0] && coffee.volume_ml <= filters.volume[1]
    const matchMilk = coffee.milk >= minMilk && coffee.milk <= maxMilk
    const matchSearch = search.length === 0 || coffee.name.toLowerCase().includes(search)
    return matchCountry && matchStrength && matchVolume && matchMilk && matchSearch
  })

  return {
    nodes: nodes.map((item) => item.id),
    edges: buildEdges(nodes),
  }
}

const fallbackCompare = (ids: string[]): CompareResponse => {
  const picked = graphPayload.nodes.filter((node) => ids.includes(node.id))
  return { items: picked }
}

export const getCoffees = async (): Promise<GraphPayload> => {
  try {
    const response = await fetch(`${API_BASE}/coffees`)
    if (!response.ok) {
      throw new Error('Failed to fetch coffees')
    }
    return (await response.json()) as GraphPayload
  } catch {
    return graphPayload
  }
}

export const getFilteredGraph = async (filters: FilterState): Promise<FilterResponse> => {
  try {
    const response = await fetch(`${API_BASE}/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    })

    if (!response.ok) {
      throw new Error('Failed to filter')
    }

    return (await response.json()) as FilterResponse
  } catch {
    return fallbackFilter(filters)
  }
}

export const getComparison = async (ids: string[]): Promise<CompareMetrics[]> => {
  try {
    const response = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    })

    if (!response.ok) {
      throw new Error('Failed to compare')
    }

    const payload = (await response.json()) as CompareResponse
    return payload.items
  } catch {
    return fallbackCompare(ids).items
  }
}
