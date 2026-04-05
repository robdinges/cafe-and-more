from typing import Literal

from pydantic import BaseModel, Field

CountryId = Literal['italy', 'spain']
RelationType = Literal['variant_of', 'similar_to', 'contains_milk', 'popular_in_country']
MilkLevel = Literal['all', 'none', 'little', 'much']


class Relation(BaseModel):
    type: RelationType
    target: str


class CoffeeNode(BaseModel):
    id: str
    name: str
    country: CountryId
    milk: int = Field(ge=0, le=100)
    water: int = Field(ge=0, le=100)
    volume_ml: int = Field(gt=0)
    strength: int = Field(ge=1, le=5)
    popularity: int = Field(ge=1, le=100)
    preparation: str
    relations: list[Relation]


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: RelationType


class GraphPayload(BaseModel):
    nodes: list[CoffeeNode]
    edges: list[GraphEdge]


class FilterPayload(BaseModel):
    countries: list[CountryId]
    milkLevel: MilkLevel = 'all'
    milkRange: list[int] = Field(default_factory=lambda: [0, 100], min_length=2, max_length=2)
    strength: list[int] = Field(min_length=2, max_length=2)
    volume: list[int] = Field(min_length=2, max_length=2)
    search: str = ''


class FilterResponse(BaseModel):
    nodes: list[str]
    edges: list[GraphEdge]


class ComparePayload(BaseModel):
    ids: list[str] = Field(min_length=2, max_length=3)


class CompareItem(BaseModel):
    id: str
    name: str
    country: CountryId
    milk: int
    water: int
    volume_ml: int
    strength: int
    preparation: str


class CompareResponse(BaseModel):
    items: list[CompareItem]
