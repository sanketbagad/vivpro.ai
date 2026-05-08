import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.data_processor import data_store


SAMPLE_SONGS = [
    {
        "index": 0,
        "id": "5vYA1mW9g2Coh1HUFUSmlb",
        "title": "3AM",
        "danceability": 0.521,
        "energy": 0.673,
        "key": 8,
        "loudness": -8.685,
        "mode": 1,
        "acousticness": 0.00573,
        "instrumentalness": 0.0,
        "liveness": 0.12,
        "valence": 0.543,
        "tempo": 108.031,
        "duration_ms": 225947,
        "time_signature": 4,
        "num_bars": 100,
        "num_sections": 8,
        "num_segments": 830,
        "class": 1,
        "star_rating": 0,
    },
    {
        "index": 1,
        "id": "2klCjJcucgGQysgH170npL",
        "title": "4 Walls",
        "danceability": 0.735,
        "energy": 0.849,
        "key": 4,
        "loudness": -4.308,
        "mode": 0,
        "acousticness": 0.212,
        "instrumentalness": 0.0000294,
        "liveness": 0.0608,
        "valence": 0.223,
        "tempo": 125.972,
        "duration_ms": 207477,
        "time_signature": 4,
        "num_bars": 107,
        "num_sections": 7,
        "num_segments": 999,
        "class": 1,
        "star_rating": 0,
    },
    {
        "index": 2,
        "id": "093PI3mdUvOSlvMYDwnV1e",
        "title": "11:11",
        "danceability": 0.445,
        "energy": 0.528,
        "key": 10,
        "loudness": -7.243,
        "mode": 1,
        "acousticness": 0.677,
        "instrumentalness": 0.0,
        "liveness": 0.155,
        "valence": 0.511,
        "tempo": 203.155,
        "duration_ms": 223452,
        "time_signature": 4,
        "num_bars": 187,
        "num_sections": 12,
        "num_segments": 776,
        "class": 1,
        "star_rating": 0,
    },
]


@pytest.fixture
def sample_songs():
    return [dict(s) for s in SAMPLE_SONGS]


@pytest.fixture
def client(sample_songs):
    with TestClient(app) as c:
        # Override after lifespan has loaded the real data
        data_store.songs = sample_songs
        yield c
    # Restore original data after test
    data_store.songs = []
