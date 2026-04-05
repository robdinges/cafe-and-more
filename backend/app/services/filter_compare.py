from app.data import COFFEE_NODES, build_edges
from app.models import CompareItem, CompareResponse, FilterPayload, FilterResponse


def milk_bounds(level: str) -> tuple[int, int]:
    if level == 'none':
        return (0, 0)
    if level == 'little':
        return (1, 40)
    if level == 'much':
        return (41, 100)
    return (0, 100)


def filter_graph(payload: FilterPayload) -> FilterResponse:
    search = payload.search.strip().lower()
    if len(payload.milkRange) == 2:
        min_milk, max_milk = payload.milkRange
    else:
        min_milk, max_milk = milk_bounds(payload.milkLevel)

    filtered = []
    for coffee in COFFEE_NODES:
        match_country = coffee.country in payload.countries
        match_strength = payload.strength[0] <= coffee.strength <= payload.strength[1]
        match_volume = payload.volume[0] <= coffee.volume_ml <= payload.volume[1]
        match_milk = min_milk <= coffee.milk <= max_milk
        match_search = search == '' or search in coffee.name.lower()

        if match_country and match_strength and match_volume and match_milk and match_search:
            filtered.append(coffee)

    edges = build_edges(filtered)
    return FilterResponse(nodes=[node.id for node in filtered], edges=edges)


def compare_coffees(ids: list[str]) -> CompareResponse:
    picked = [node for node in COFFEE_NODES if node.id in ids]
    items = [
        CompareItem(
            id=node.id,
            name=node.name,
            country=node.country,
            milk=node.milk,
            water=node.water,
            volume_ml=node.volume_ml,
            strength=node.strength,
            preparation=node.preparation,
        )
        for node in picked
    ]
    return CompareResponse(items=items)
