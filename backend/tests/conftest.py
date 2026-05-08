import os

# Must be set before any app module is imported so database.py picks up SQLite
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402

from app.database import Base, get_db  # noqa: E402
from app.db_models import SongDB  # noqa: E402
from app.main import app  # noqa: E402

_TEST_DB_URL = "sqlite:///./test.db"
_engine = create_engine(_TEST_DB_URL, connect_args={"check_same_thread": False})
_TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=_engine)

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
        "song_class": 1,
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
        "song_class": 1,
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
        "song_class": 1,
        "star_rating": 0,
    },
]


@pytest.fixture(scope="session", autouse=True)
def _create_tables():
    Base.metadata.create_all(bind=_engine)
    yield
    Base.metadata.drop_all(bind=_engine)


@pytest.fixture
def db_session(_create_tables):
    session = _TestingSession()
    session.query(SongDB).delete()
    session.commit()
    for s in SAMPLE_SONGS:
        session.add(SongDB(**s))
    session.commit()
    yield session
    session.close()


@pytest.fixture
def client(db_session):
    def _override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    # Do NOT use as context manager — avoids running lifespan which would
    # try to seed from playlist.json into our isolated test session.
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_songs():
    return [dict(s) for s in SAMPLE_SONGS]
