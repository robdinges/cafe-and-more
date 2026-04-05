from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.data import COFFEE_NODES, build_edges
from app.models import ComparePayload, CompareResponse, FilterPayload, FilterResponse, GraphPayload
from app.services.filter_compare import compare_coffees, filter_graph

app = FastAPI(title='Coffee Explorer API', version='0.1.0')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok'}


@app.get('/api/coffees', response_model=GraphPayload)
def get_coffees() -> GraphPayload:
    return GraphPayload(nodes=COFFEE_NODES, edges=build_edges(COFFEE_NODES))


@app.post('/api/filter', response_model=FilterResponse)
def filter_coffees(payload: FilterPayload) -> FilterResponse:
    return filter_graph(payload)


@app.post('/api/compare', response_model=CompareResponse)
def compare(payload: ComparePayload) -> CompareResponse:
    return compare_coffees(payload.ids)
