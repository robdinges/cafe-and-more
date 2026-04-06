import { CoffeeNode, CountryId, GraphEdge, GraphPayload } from '../types/coffee'

export const countryNotes: Record<CountryId, string> = {
  italy:
    'Italian coffee culture favors concise, high-intensity drinks and ritualized daily bar visits.',
  spain:
    'Spanish coffee traditions mix espresso intensity with social, milk-forward drinks often served throughout the day.',
  france:
    'French cafe culture centers on longer sit-down moments with smooth milk coffee and classic terrace rituals.',
}

export const coffeeNodes: CoffeeNode[] = [
  {
    id: 'espresso',
    name: 'Espresso',
    country: 'italy',
    milk: 0,
    water: 100,
    volume_ml: 30,
    strength: 5,
    popularity: 95,
    preparation: 'Finely ground coffee extracted quickly under high pressure.',
    relations: [
      { type: 'popular_in_country', target: 'italy' },
      { type: 'variant_of', target: 'ristretto' },
      { type: 'variant_of', target: 'lungo' },
      { type: 'similar_to', target: 'cafe-solo' },
    ],
  },
  {
    id: 'ristretto',
    name: 'Ristretto',
    country: 'italy',
    milk: 0,
    water: 100,
    volume_ml: 20,
    strength: 5,
    popularity: 70,
    preparation: 'A shorter espresso shot with less water and concentrated flavor.',
    relations: [
      { type: 'popular_in_country', target: 'italy' },
      { type: 'variant_of', target: 'espresso' },
      { type: 'similar_to', target: 'cafe-solo' },
    ],
  },
  {
    id: 'lungo',
    name: 'Lungo',
    country: 'italy',
    milk: 0,
    water: 100,
    volume_ml: 60,
    strength: 3,
    popularity: 68,
    preparation: 'An espresso pulled longer with more water through the same grounds.',
    relations: [
      { type: 'popular_in_country', target: 'italy' },
      { type: 'variant_of', target: 'espresso' },
      { type: 'similar_to', target: 'americano' },
    ],
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    country: 'italy',
    milk: 55,
    water: 45,
    volume_ml: 180,
    strength: 3,
    popularity: 90,
    preparation: 'Espresso with steamed milk and airy foam in near-equal parts.',
    relations: [
      { type: 'popular_in_country', target: 'italy' },
      { type: 'contains_milk', target: 'latte' },
      { type: 'contains_milk', target: 'macchiato' },
      { type: 'similar_to', target: 'cafe-con-leche' },
    ],
  },
  {
    id: 'latte',
    name: 'Latte',
    country: 'italy',
    milk: 70,
    water: 30,
    volume_ml: 240,
    strength: 2,
    popularity: 85,
    preparation: 'Espresso mixed with a high ratio of steamed milk and light foam.',
    relations: [
      { type: 'popular_in_country', target: 'italy' },
      { type: 'contains_milk', target: 'cappuccino' },
      { type: 'similar_to', target: 'cafe-con-leche' },
    ],
  },
  {
    id: 'macchiato',
    name: 'Macchiato',
    country: 'italy',
    milk: 20,
    water: 80,
    volume_ml: 45,
    strength: 4,
    popularity: 74,
    preparation: 'Espresso marked with a small amount of milk foam.',
    relations: [
      { type: 'popular_in_country', target: 'italy' },
      { type: 'contains_milk', target: 'espresso' },
      { type: 'similar_to', target: 'cortado' },
    ],
  },
  {
    id: 'cafe-solo',
    name: 'Cafe solo',
    country: 'spain',
    milk: 0,
    water: 100,
    volume_ml: 30,
    strength: 5,
    popularity: 88,
    preparation: 'A straight Spanish espresso, typically bold and short.',
    relations: [
      { type: 'popular_in_country', target: 'spain' },
      { type: 'similar_to', target: 'espresso' },
      { type: 'variant_of', target: 'americano' },
    ],
  },
  {
    id: 'cortado',
    name: 'Cortado',
    country: 'spain',
    milk: 35,
    water: 65,
    volume_ml: 90,
    strength: 4,
    popularity: 80,
    preparation: 'Espresso cut with a small amount of warm milk.',
    relations: [
      { type: 'popular_in_country', target: 'spain' },
      { type: 'contains_milk', target: 'cafe-con-leche' },
      { type: 'similar_to', target: 'macchiato' },
    ],
  },
  {
    id: 'cafe-con-leche',
    name: 'Cafe con leche',
    country: 'spain',
    milk: 60,
    water: 40,
    volume_ml: 200,
    strength: 3,
    popularity: 93,
    preparation: 'Espresso blended with hot milk, often near half-and-half.',
    relations: [
      { type: 'popular_in_country', target: 'spain' },
      { type: 'contains_milk', target: 'cortado' },
      { type: 'similar_to', target: 'latte' },
      { type: 'similar_to', target: 'cappuccino' },
    ],
  },
  {
    id: 'americano',
    name: 'Americano',
    country: 'spain',
    milk: 0,
    water: 100,
    volume_ml: 120,
    strength: 2,
    popularity: 72,
    preparation: 'Espresso diluted with hot water for a longer, lighter cup.',
    relations: [
      { type: 'popular_in_country', target: 'spain' },
      { type: 'variant_of', target: 'cafe-solo' },
      { type: 'similar_to', target: 'lungo' },
    ],
  },
  {
    id: 'bombon',
    name: 'Bombon',
    country: 'spain',
    milk: 55,
    water: 45,
    volume_ml: 70,
    strength: 4,
    popularity: 66,
    preparation: 'Espresso layered with sweetened condensed milk.',
    relations: [
      { type: 'popular_in_country', target: 'spain' },
      { type: 'contains_milk', target: 'cafe-con-leche' },
      { type: 'similar_to', target: 'carajillo' },
    ],
  },
  {
    id: 'carajillo',
    name: 'Carajillo',
    country: 'spain',
    milk: 5,
    water: 95,
    volume_ml: 75,
    strength: 4,
    popularity: 60,
    preparation: 'Espresso paired with a splash of liquor, often served warm.',
    relations: [
      { type: 'popular_in_country', target: 'spain' },
      { type: 'similar_to', target: 'bombon' },
      { type: 'similar_to', target: 'espresso' },
    ],
  },
  {
    id: 'cafe',
    name: 'Cafe',
    country: 'france',
    milk: 0,
    water: 100,
    volume_ml: 45,
    strength: 4,
    popularity: 82,
    preparation: 'A French cafe noir served as a short, aromatic black coffee.',
    relations: [
      { type: 'popular_in_country', target: 'france' },
      { type: 'similar_to', target: 'espresso' },
      { type: 'variant_of', target: 'grand-creme' },
    ],
  },
  {
    id: 'cafe-au-lait',
    name: 'Cafe au lait',
    country: 'france',
    milk: 62,
    water: 38,
    volume_ml: 230,
    strength: 3,
    popularity: 87,
    preparation: 'Hot brewed coffee blended with warm milk, often served in a bowl at breakfast.',
    relations: [
      { type: 'popular_in_country', target: 'france' },
      { type: 'contains_milk', target: 'grand-creme' },
      { type: 'similar_to', target: 'cafe-con-leche' },
      { type: 'similar_to', target: 'latte' },
    ],
  },
  {
    id: 'grand-creme',
    name: 'Grand creme',
    country: 'france',
    milk: 50,
    water: 50,
    volume_ml: 190,
    strength: 3,
    popularity: 79,
    preparation: 'A larger cafe with steamed milk, creamy texture, and balanced intensity.',
    relations: [
      { type: 'popular_in_country', target: 'france' },
      { type: 'contains_milk', target: 'cafe' },
      { type: 'contains_milk', target: 'cafe-au-lait' },
      { type: 'similar_to', target: 'cappuccino' },
    ],
  },
]

export const buildEdges = (nodes: CoffeeNode[]): GraphEdge[] => {
  const ids = new Set(nodes.map((node) => node.id))
  const edges: GraphEdge[] = []

  for (const node of nodes) {
    for (const relation of node.relations) {
      if (!ids.has(relation.target)) {
        continue
      }

      const source = node.id
      const target = relation.target
      const [from, to] = source < target ? [source, target] : [target, source]
      const key = `${from}-${to}-${relation.type}`

      if (!edges.some((edge) => edge.id === key)) {
        edges.push({
          id: key,
          source,
          target,
          type: relation.type,
        })
      }
    }
  }

  return edges
}

export const graphPayload: GraphPayload = {
  nodes: coffeeNodes,
  edges: buildEdges(coffeeNodes),
}
