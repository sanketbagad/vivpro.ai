from sqlalchemy import Column, Float, Integer, String

from app.database import Base


class SongDB(Base):
    __tablename__ = "songs"

    index = Column(Integer, primary_key=True, index=True)
    id = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False, index=True)
    danceability = Column(Float)
    energy = Column(Float)
    key = Column(Integer)
    loudness = Column(Float)
    mode = Column(Integer)
    acousticness = Column(Float)
    instrumentalness = Column(Float)
    liveness = Column(Float)
    valence = Column(Float)
    tempo = Column(Float)
    duration_ms = Column(Integer)
    time_signature = Column(Integer)
    num_bars = Column(Integer)
    num_sections = Column(Integer)
    num_segments = Column(Integer)
    song_class = Column(Integer, default=1)  # "class" in source JSON
    star_rating = Column(Integer, default=0)
