export type CountryId = 'italy' | 'spain'

export type RelationType =
  | 'variant_of'
  | 'similar_to'
  | 'contains_milk'
  | 'popular_in_country'

export interface CoffeeRelation {
  type: RelationType
  target: string
}

export interface CoffeeNode {
  id: string
  name: string
  country: CountryId
  milk: number
  water: number
  volume_ml: number
  strength: 1 | 2 | 3 | 4 | 5
  popularity: number
  preparation: string
  relations: CoffeeRelation[]
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: RelationType
}

export interface GraphPayload {
  nodes: CoffeeNode[]
  edges: GraphEdge[]
}

export type MilkLevel = 'all' | 'none' | 'little' | 'much'

export interface FilterState {
  countries: CountryId[]
  milkLevel: MilkLevel
  strength: [number, number]
  volume: [number, number]
  search: string
}

export interface CompareMetrics {
  id: string
  name: string
  country: CountryId
  milk: number
  water: number
  volume_ml: number
  strength: number
  preparation: string
}
