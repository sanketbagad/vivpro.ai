from fastapi import APIRouter, HTTPException
from typing import List

from app.models import PaginatedResponse, RatingUpdate, Song
from app.services.data_processor import data_store

router = APIRouter()


@router.get("/songs", response_model=PaginatedResponse)
def get_songs(page: int = 1, limit: int = 10) -> PaginatedResponse:
    return data_store.get_all(page=page, limit=limit)


@router.get("/songs/all", response_model=List[Song])
def get_all_songs() -> List[Song]:
    return data_store.get_all_songs()


@router.get("/songs/search", response_model=List[Song])
def search_songs(title: str = "") -> List[Song]:
    return data_store.search_by_title(title)


@router.put("/songs/{index}/rating", response_model=Song)
def update_rating(index: int, body: RatingUpdate) -> Song:
    song = data_store.update_rating(index, body.rating)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song
