# Songs Playlist Dashboard

A full-stack web application for browsing, searching, and rating a music playlist. Built with FastAPI + PostgreSQL on the backend and React (Vite) on the frontend. Runs entirely in Docker with a single command.

## Tech Stack

- **Backend**: FastAPI, Pydantic v2, SQLAlchemy 2, Uvicorn, Python 3.11+
- **Database**: PostgreSQL 16 (Docker) / SQLite (local dev & tests)
- **Frontend**: React 18, Vite, Recharts, Axios
- **Testing**: pytest (backend, uses SQLite in-memory), Vitest + Testing Library (frontend)
- **Linting**: Ruff (Python), ESLint + Prettier (JS)
- **CI/CD**: GitHub Actions
- **Pre-commit**: hooks for formatting, linting, and tests
- **Containers**: Docker + Docker Compose

---

## Quick Start — Docker (recommended)

> Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Compose v2.

```bash
git clone <repo-url>
cd fullstack

# 1. Create your env file from the template
cp .env.example .env
# Edit .env if you want different credentials (optional)

# 2. Build and start all three services
docker compose up --build
```

| Service    | URL                         |
|------------|-----------------------------|
| Frontend   | http://localhost:3000        |
| Backend API| http://localhost:8000        |
| Postgres   | localhost:5432               |

On first boot, the backend seeds the 100-song dataset into PostgreSQL automatically. All three services support **hot reload** — edit files locally and changes appear instantly.

### Useful Docker commands

```bash
# Run in background
docker compose up -d --build

# Stop everything (data is preserved in the postgres_data volume)
docker compose down

# Stop and wipe the database volume (full reset)
docker compose down -v

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Open a psql shell
docker compose exec postgres psql -U songsuser -d songsdb
```

---

## Environment Variables

Copy `.env.example` to `.env`. Docker Compose reads `.env` automatically.

| Variable            | Default       | Description                              |
|---------------------|---------------|------------------------------------------|
| `POSTGRES_USER`     | `songsuser`   | PostgreSQL username                      |
| `POSTGRES_PASSWORD` | `changeme`    | PostgreSQL password                      |
| `POSTGRES_DB`       | `songsdb`     | PostgreSQL database name                 |
| `POSTGRES_HOST`     | `postgres`    | Hostname (use `postgres` inside Docker)  |
| `POSTGRES_PORT`     | `5432`        | Port exposed on host                     |

The `DATABASE_URL` used by the backend is assembled automatically inside `docker-compose.yml`:
```
postgresql://<USER>:<PASSWORD>@postgres:<PORT>/<DB>
```

> **Tests always use SQLite** (in-memory). You never need Postgres to run the test suite.

---

## Local Development (without Docker)

### Prerequisites
- Python 3.11+, Node 20+, npm

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements-dev.txt
uvicorn app.main:app --reload
```

With no `DATABASE_URL` environment variable set, the backend defaults to **SQLite** (`songs.db`). To use Postgres locally, set `DATABASE_URL` before starting:

```bash
# Windows PowerShell
$env:DATABASE_URL = "postgresql://songsuser:songspassword@localhost:5432/songsdb"

# macOS/Linux
export DATABASE_URL="postgresql://songsuser:songspassword@localhost:5432/songsdb"

uvicorn app.main:app --reload
```

API available at http://localhost:8000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App available at http://localhost:3000 — Vite proxies `/api` to `http://localhost:8000`.

### Pre-commit Setup (one-time)

```bash
pip install pre-commit
pre-commit install
```

Every `git commit` now runs: ruff lint/format, prettier, backend tests, and frontend ESLint automatically.

---

## API Endpoints

| Method | Endpoint                     | Description                        |
|--------|------------------------------|------------------------------------|
| GET    | `/`                          | Health check + active DB info      |
| GET    | `/api/songs`                 | Paginated songs (default 10/page)  |
| GET    | `/api/songs?page=2&limit=5`  | Custom pagination                  |
| GET    | `/api/songs/all`             | All 100 songs (used for CSV)       |
| GET    | `/api/songs/search?title=3AM`| Case-insensitive partial search    |
| PUT    | `/api/songs/{index}/rating`  | Set star rating `{"rating": 4}`    |

### Response shapes

**GET /api/songs**
```json
{
  "total": 100,
  "page": 1,
  "limit": 10,
  "data": [{ "index": 0, "title": "3AM", "danceability": 0.521, ... }]
}
```

**PUT /api/songs/0/rating** → body `{"rating": 4}`
```json
{ "index": 0, "title": "3AM", "star_rating": 4, ... }
```

---

## Running Tests

### Backend (uses SQLite — no Postgres needed)

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm test
```

### Linting

```bash
# Backend
cd backend && ruff check . && ruff format --check .

# Frontend
cd frontend && npm run lint
```

---

## Project Structure

```
fullstack/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry, CORS, lifespan (create tables + seed)
│   │   ├── models.py            # Pydantic schemas (Song, PaginatedResponse, RatingUpdate)
│   │   ├── database.py          # SQLAlchemy engine, SessionLocal, get_db dependency
│   │   ├── db_models.py         # SQLAlchemy ORM model (SongDB table)
│   │   ├── routes/songs.py      # REST route handlers
│   │   └── services/
│   │       └── data_processor.py  # JSON normalizer + seed_database()
│   ├── data/playlist.json       # 100-song dataset (columnar JSON)
│   ├── tests/                   # pytest suite (SQLite override via conftest)
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── App.jsx / App.css
│   │   ├── components/
│   │   │   ├── SongsTable/      # Sortable, paginated table + inline star rating
│   │   │   ├── SearchBar/       # Title search + "Get Song" button
│   │   │   ├── StarRating/      # 5-star widget
│   │   │   └── Charts/          # Scatter, Histogram, 2× BarChart (Recharts)
│   │   └── services/api.js      # Axios calls
│   ├── Dockerfile
│   ├── vite.config.js           # Proxy target configurable via BACKEND_URL env var
│   └── package.json
├── docker-compose.yml           # postgres + backend + frontend services
├── .env                         # Local secrets (gitignored)
├── .env.example                 # Template committed to repo
├── .github/workflows/ci.yml     # GitHub Actions CI
├── .pre-commit-config.yaml
├── .gitignore
└── README.md
```

## Features

- Browse 100 songs in a paginated, sortable table (10 rows/page)
- Case-insensitive title search with "Get Song" button
- Interactive 5-star rating (persisted to PostgreSQL)
- Download full dataset as CSV
- 4 analytics charts: danceability scatter, duration histogram, acousticness bar, tempo bar
