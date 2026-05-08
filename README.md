# Songs Playlist Dashboard

A full-stack web application for browsing, searching, and rating a music playlist. Built with FastAPI (Python) on the backend and React (Vite) on the frontend.

## Tech Stack

- **Backend**: FastAPI, Pydantic v2, Uvicorn, Python 3.11+
- **Frontend**: React 18, Vite, Recharts, Axios
- **Testing**: pytest + httpx (backend), Vitest + Testing Library (frontend)
- **Linting**: Ruff (Python), ESLint + Prettier (JS)
- **CI/CD**: GitHub Actions
- **Pre-commit**: pre-commit hooks for formatting, linting, and tests

## Prerequisites

- Python 3.11+
- Node 20+
- npm

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repo-url>
cd fullstack
```

### 2. Backend Setup

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

The API will be available at http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at http://localhost:3000

### 4. Pre-commit Setup

```bash
pip install pre-commit
pre-commit install
```

## API Endpoints

| Method | Endpoint                   | Description                        |
|--------|----------------------------|------------------------------------|
| GET    | `/`                        | Health check                       |
| GET    | `/api/songs`               | Paginated songs list               |
| GET    | `/api/songs?page=1&limit=10` | Paginated with params            |
| GET    | `/api/songs/all`           | All songs (for CSV export)         |
| GET    | `/api/songs/search?title=` | Search songs by title              |
| PUT    | `/api/songs/{index}/rating`| Update star rating (0-5)           |

### Example Responses

**GET /api/songs**
```json
{
  "total": 100,
  "page": 1,
  "limit": 10,
  "data": [...]
}
```

**PUT /api/songs/0/rating** (body: `{"rating": 4}`)
```json
{
  "index": 0,
  "title": "3AM",
  "star_rating": 4,
  ...
}
```

## Running Tests

### Backend Tests

```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Linting

```bash
# Backend
cd backend
ruff check .
ruff format --check .

# Frontend
cd frontend
npm run lint
npm run format
```

## Project Structure

```
fullstack/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py           # App entry point, CORS, lifespan
│   │   ├── models.py         # Pydantic models (Song, PaginatedResponse, RatingUpdate)
│   │   ├── routes/songs.py   # API route handlers
│   │   └── services/
│   │       └── data_processor.py  # Data loading & DataStore singleton
│   ├── data/playlist.json    # Source dataset (100 songs, columnar format)
│   ├── tests/                # pytest test suite
│   ├── requirements.txt      # Production dependencies
│   ├── requirements-dev.txt  # Dev + test dependencies
│   └── pyproject.toml        # Ruff & pytest configuration
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Global styles
│   │   ├── components/
│   │   │   ├── SongsTable/   # Paginated, sortable data table with star rating
│   │   │   ├── SearchBar/    # Title search input
│   │   │   ├── StarRating/   # 5-star interactive rating widget
│   │   │   └── Charts/       # 4 Recharts visualizations
│   │   └── services/api.js   # Axios API client
│   ├── package.json
│   ├── vite.config.js
│   └── vitest.config.js
├── .github/workflows/ci.yml  # GitHub Actions CI pipeline
├── .pre-commit-config.yaml   # Pre-commit hooks
├── .gitignore
└── README.md
```

## Features

- Browse all 100 songs in a paginated, sortable table
- Search songs by title (case-insensitive partial match)
- Rate songs with an interactive 5-star widget
- Download full dataset as CSV
- 4 analytics charts:
  - Danceability scatter plot
  - Duration distribution histogram
  - Acousticness bar chart (first 20 songs)
  - Tempo bar chart (first 20 songs)
