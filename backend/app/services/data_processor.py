import json
from typing import Optional

from app.models import PaginatedResponse, Song


def load_and_normalize(filepath: str) -> list[dict]:
    """Read columnar JSON, normalize to row format, add star_rating=0."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Get all string indices from the first column
    first_key = next(iter(data))
    indices = list(data[first_key].keys())

    records = []
    for idx_str in indices:
        record = {"index": int(idx_str)}
        for col, values in data.items():
            val = values.get(idx_str)
            # Store "class" column as-is (will be aliased in Pydantic)
            record[col] = val
        record["star_rating"] = 0
        records.append(record)

    return records


class DataStore:
    """Singleton data store for songs."""

    _instance: Optional["DataStore"] = None
    songs: list[dict]

    def __new__(cls) -> "DataStore":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.songs = []
        return cls._instance

    def load(self, filepath: str) -> None:
        self.songs = load_and_normalize(filepath)

    def get_all(self, page: int = 1, limit: int = 10) -> PaginatedResponse:
        total = len(self.songs)
        start = (page - 1) * limit
        end = start + limit
        page_songs = self.songs[start:end]
        song_models = [Song(**{**s, "class": s.get("class", 1)}) for s in page_songs]
        return PaginatedResponse(total=total, page=page, limit=limit, data=song_models)

    def search_by_title(self, title: str) -> list[Song]:
        title_lower = title.lower()
        results = []
        for s in self.songs:
            if title_lower in s.get("title", "").lower():
                results.append(Song(**{**s, "class": s.get("class", 1)}))
        return results

    def update_rating(self, index: int, rating: int) -> Optional[Song]:
        if index < 0 or index >= len(self.songs):
            return None
        self.songs[index]["star_rating"] = rating
        s = self.songs[index]
        return Song(**{**s, "class": s.get("class", 1)})

    def get_all_songs(self) -> list[Song]:
        return [Song(**{**s, "class": s.get("class", 1)}) for s in self.songs]


# Module-level singleton
data_store = DataStore()
