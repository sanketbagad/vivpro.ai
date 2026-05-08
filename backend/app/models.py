from pydantic import BaseModel, ConfigDict, Field
from typing import List


class Song(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    index: int
    id: str
    title: str
    danceability: float
    energy: float
    key: int
    loudness: float
    mode: int
    acousticness: float
    instrumentalness: float
    liveness: float
    valence: float
    tempo: float
    duration_ms: int
    time_signature: int
    num_bars: int
    num_sections: int
    num_segments: int
    class_field: int = Field(alias="class")
    star_rating: int = 0


class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    data: List[Song]


class RatingUpdate(BaseModel):
    rating: int = Field(ge=0, le=5)
