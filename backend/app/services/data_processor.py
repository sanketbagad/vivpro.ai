import json

from sqlalchemy.orm import Session

from app.db_models import SongDB


def load_and_normalize(filepath: str) -> list[dict]:
    """Read columnar JSON, normalize to list of row dicts."""
    with open(filepath, encoding="utf-8") as f:
        data = json.load(f)

    first_key = next(iter(data))
    indices = list(data[first_key].keys())

    records = []
    for idx_str in indices:
        record = {"index": int(idx_str)}
        for col, values in data.items():
            record[col] = values.get(idx_str)
        records.append(record)

    return records


def seed_database(db: Session, filepath: str) -> None:
    """Seed songs table from playlist JSON if empty."""
    if db.query(SongDB).count() > 0:
        return

    records = load_and_normalize(filepath)
    for r in records:
        db.add(
            SongDB(
                index=r["index"],
                id=r["id"],
                title=r["title"],
                danceability=r.get("danceability"),
                energy=r.get("energy"),
                key=r.get("key"),
                loudness=r.get("loudness"),
                mode=r.get("mode"),
                acousticness=r.get("acousticness"),
                instrumentalness=r.get("instrumentalness"),
                liveness=r.get("liveness"),
                valence=r.get("valence"),
                tempo=r.get("tempo"),
                duration_ms=r.get("duration_ms"),
                time_signature=r.get("time_signature"),
                num_bars=r.get("num_bars"),
                num_sections=r.get("num_sections"),
                num_segments=r.get("num_segments"),
                song_class=r.get("class", 1),
                star_rating=0,
            )
        )
    db.commit()
