from app.models import CoffeeNode, GraphEdge

COFFEE_NODES = [
    CoffeeNode(
        id='espresso',
        name='Espresso',
        country='italy',
        milk=0,
        water=100,
        volume_ml=30,
        strength=5,
        popularity=95,
        preparation='Finely ground coffee extracted quickly under high pressure.',
        relations=[
            {'type': 'popular_in_country', 'target': 'italy'},
            {'type': 'variant_of', 'target': 'ristretto'},
            {'type': 'variant_of', 'target': 'lungo'},
            {'type': 'similar_to', 'target': 'cafe-solo'},
        ],
    ),
    CoffeeNode(
        id='ristretto',
        name='Ristretto',
        country='italy',
        milk=0,
        water=100,
        volume_ml=20,
        strength=5,
        popularity=70,
        preparation='A shorter espresso shot with less water and concentrated flavor.',
        relations=[
            {'type': 'popular_in_country', 'target': 'italy'},
            {'type': 'variant_of', 'target': 'espresso'},
            {'type': 'similar_to', 'target': 'cafe-solo'},
        ],
    ),
    CoffeeNode(
        id='lungo',
        name='Lungo',
        country='italy',
        milk=0,
        water=100,
        volume_ml=60,
        strength=3,
        popularity=68,
        preparation='An espresso pulled longer with more water through the same grounds.',
        relations=[
            {'type': 'popular_in_country', 'target': 'italy'},
            {'type': 'variant_of', 'target': 'espresso'},
            {'type': 'similar_to', 'target': 'americano'},
        ],
    ),
    CoffeeNode(
        id='cappuccino',
        name='Cappuccino',
        country='italy',
        milk=55,
        water=45,
        volume_ml=180,
        strength=3,
        popularity=90,
        preparation='Espresso with steamed milk and airy foam in near-equal parts.',
        relations=[
            {'type': 'popular_in_country', 'target': 'italy'},
            {'type': 'contains_milk', 'target': 'latte'},
            {'type': 'contains_milk', 'target': 'macchiato'},
            {'type': 'similar_to', 'target': 'cafe-con-leche'},
        ],
    ),
    CoffeeNode(
        id='latte',
        name='Latte',
        country='italy',
        milk=70,
        water=30,
        volume_ml=240,
        strength=2,
        popularity=85,
        preparation='Espresso mixed with a high ratio of steamed milk and light foam.',
        relations=[
            {'type': 'popular_in_country', 'target': 'italy'},
            {'type': 'contains_milk', 'target': 'cappuccino'},
            {'type': 'similar_to', 'target': 'cafe-con-leche'},
        ],
    ),
    CoffeeNode(
        id='macchiato',
        name='Macchiato',
        country='italy',
        milk=20,
        water=80,
        volume_ml=45,
        strength=4,
        popularity=74,
        preparation='Espresso marked with a small amount of milk foam.',
        relations=[
            {'type': 'popular_in_country', 'target': 'italy'},
            {'type': 'contains_milk', 'target': 'espresso'},
            {'type': 'similar_to', 'target': 'cortado'},
        ],
    ),
    CoffeeNode(
        id='cafe-solo',
        name='Cafe solo',
        country='spain',
        milk=0,
        water=100,
        volume_ml=30,
        strength=5,
        popularity=88,
        preparation='A straight Spanish espresso, typically bold and short.',
        relations=[
            {'type': 'popular_in_country', 'target': 'spain'},
            {'type': 'similar_to', 'target': 'espresso'},
            {'type': 'variant_of', 'target': 'americano'},
        ],
    ),
    CoffeeNode(
        id='cortado',
        name='Cortado',
        country='spain',
        milk=35,
        water=65,
        volume_ml=90,
        strength=4,
        popularity=80,
        preparation='Espresso cut with a small amount of warm milk.',
        relations=[
            {'type': 'popular_in_country', 'target': 'spain'},
            {'type': 'contains_milk', 'target': 'cafe-con-leche'},
            {'type': 'similar_to', 'target': 'macchiato'},
        ],
    ),
    CoffeeNode(
        id='cafe-con-leche',
        name='Cafe con leche',
        country='spain',
        milk=60,
        water=40,
        volume_ml=200,
        strength=3,
        popularity=93,
        preparation='Espresso blended with hot milk, often near half-and-half.',
        relations=[
            {'type': 'popular_in_country', 'target': 'spain'},
            {'type': 'contains_milk', 'target': 'cortado'},
            {'type': 'similar_to', 'target': 'latte'},
            {'type': 'similar_to', 'target': 'cappuccino'},
        ],
    ),
    CoffeeNode(
        id='americano',
        name='Americano',
        country='spain',
        milk=0,
        water=100,
        volume_ml=120,
        strength=2,
        popularity=72,
        preparation='Espresso diluted with hot water for a longer, lighter cup.',
        relations=[
            {'type': 'popular_in_country', 'target': 'spain'},
            {'type': 'variant_of', 'target': 'cafe-solo'},
            {'type': 'similar_to', 'target': 'lungo'},
        ],
    ),
    CoffeeNode(
        id='bombon',
        name='Bombon',
        country='spain',
        milk=55,
        water=45,
        volume_ml=70,
        strength=4,
        popularity=66,
        preparation='Espresso layered with sweetened condensed milk.',
        relations=[
            {'type': 'popular_in_country', 'target': 'spain'},
            {'type': 'contains_milk', 'target': 'cafe-con-leche'},
            {'type': 'similar_to', 'target': 'carajillo'},
        ],
    ),
    CoffeeNode(
        id='carajillo',
        name='Carajillo',
        country='spain',
        milk=5,
        water=95,
        volume_ml=75,
        strength=4,
        popularity=60,
        preparation='Espresso paired with a splash of liquor, often served warm.',
        relations=[
            {'type': 'popular_in_country', 'target': 'spain'},
            {'type': 'similar_to', 'target': 'bombon'},
            {'type': 'similar_to', 'target': 'espresso'},
        ],
    ),
    CoffeeNode(
        id='cafe',
        name='Cafe',
        country='france',
        milk=0,
        water=100,
        volume_ml=45,
        strength=4,
        popularity=82,
        preparation='A French cafe noir served as a short, aromatic black coffee.',
        relations=[
            {'type': 'popular_in_country', 'target': 'france'},
            {'type': 'similar_to', 'target': 'espresso'},
            {'type': 'variant_of', 'target': 'grand-creme'},
        ],
    ),
    CoffeeNode(
        id='cafe-au-lait',
        name='Cafe au lait',
        country='france',
        milk=62,
        water=38,
        volume_ml=230,
        strength=3,
        popularity=87,
        preparation='Hot brewed coffee blended with warm milk, often served in a bowl at breakfast.',
        relations=[
            {'type': 'popular_in_country', 'target': 'france'},
            {'type': 'contains_milk', 'target': 'grand-creme'},
            {'type': 'similar_to', 'target': 'cafe-con-leche'},
            {'type': 'similar_to', 'target': 'latte'},
        ],
    ),
    CoffeeNode(
        id='grand-creme',
        name='Grand creme',
        country='france',
        milk=50,
        water=50,
        volume_ml=190,
        strength=3,
        popularity=79,
        preparation='A larger cafe with steamed milk, creamy texture, and balanced intensity.',
        relations=[
            {'type': 'popular_in_country', 'target': 'france'},
            {'type': 'contains_milk', 'target': 'cafe'},
            {'type': 'contains_milk', 'target': 'cafe-au-lait'},
            {'type': 'similar_to', 'target': 'cappuccino'},
        ],
    ),
]


def build_edges(nodes: list[CoffeeNode]) -> list[GraphEdge]:
    ids = {node.id for node in nodes}
    edges: list[GraphEdge] = []
    seen: set[str] = set()

    for node in nodes:
        for relation in node.relations:
            if relation.target not in ids:
                continue

            source = node.id
            target = relation.target
            ordered = sorted([source, target])
            edge_id = f"{ordered[0]}-{ordered[1]}-{relation.type}"
            if edge_id in seen:
                continue

            seen.add(edge_id)
            edges.append(
                GraphEdge(
                    id=edge_id,
                    source=source,
                    target=target,
                    type=relation.type,
                )
            )

    return edges
