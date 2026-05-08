from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.songs import router
from app.services.data_processor import data_store


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load data on startup
    data_path = os.path.join(os.path.dirname(__file__), "..", "data", "playlist.json")
    data_path = os.path.abspath(data_path)
    data_store.load(data_path)
    yield
    # Cleanup on shutdown (nothing needed here)


app = FastAPI(title="Songs Playlist Dashboard", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok"}
