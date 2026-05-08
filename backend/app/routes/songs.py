from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.db_models import SongDB
from app.models import PaginatedResponse, RatingUpdate, Song

router = APIRouter()


def _to_schema(s: SongDB) -> Song:
    return Song.model_validate(
        {
            "index": s.index,
            "id": s.id,
            "title": s.title,
            "danceability": s.danceability,
            "energy": s.energy,
            "key": s.key,
            "loudness": s.loudness,
            "mode": s.mode,
            "acousticness": s.acousticness,
            "instrumentalness": s.instrumentalness,
            "liveness": s.liveness,
            "valence": s.valence,
            "tempo": s.tempo,
            "duration_ms": s.duration_ms,
            "time_signature": s.time_signature,
            "num_bars": s.num_bars,
            "num_sections": s.num_sections,
            "num_segments": s.num_segments,
            "class_field": s.song_class,
            "star_rating": s.star_rating,
        }
    )


@router.get("/songs", response_model=PaginatedResponse)
def get_songs(
    page: int = 1, limit: int = 10, db: Session = Depends(get_db)
) -> PaginatedResponse:
    total = db.query(func.count(SongDB.index)).scalar()
    songs = (
        db.query(SongDB).order_by(SongDB.index).offset((page - 1) * limit).limit(limit).all()
    )
    return PaginatedResponse(
        total=total, page=page, limit=limit, data=[_to_schema(s) for s in songs]
    )


@router.get("/songs/all", response_model=List[Song])
def get_all_songs(db: Session = Depends(get_db)) -> List[Song]:
    songs = db.query(SongDB).order_by(SongDB.index).all()
    return [_to_schema(s) for s in songs]


@router.get("/songs/search", response_model=List[Song])
def search_songs(title: str = "", db: Session = Depends(get_db)) -> List[Song]:
    songs = (
        db.query(SongDB)
        .filter(func.lower(SongDB.title).like(f"%{title.lower()}%"))
        .order_by(SongDB.index)
        .all()
    )
    return [_to_schema(s) for s in songs]


@router.put("/songs/{index}/rating", response_model=Song)
def update_rating(
    index: int, body: RatingUpdate, db: Session = Depends(get_db)
) -> Song:
    song = db.query(SongDB).filter(SongDB.index == index).first()
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    song.star_rating = body.rating
    db.commit()
    db.refresh(song)
    return _to_schema(song)
