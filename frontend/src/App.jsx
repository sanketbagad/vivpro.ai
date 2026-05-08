import { useState, useEffect, useCallback } from 'react'
import './App.css'
import SearchBar from './components/SearchBar'
import SongsTable from './components/SongsTable'
import {
  DanceabilityScatter,
  DurationHistogram,
  AcousticsBarChart,
  TempoBarChart,
} from './components/Charts'
import { getSongs, getAllSongs, searchSong, rateSong } from './services/api'

function App() {
  const [songs, setSongs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortCol, setSortCol] = useState('')
  const [sortDir, setSortDir] = useState('asc')
  const [searchTitle, setSearchTitle] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [allSongs, setAllSongs] = useState([])

  const fetchSongs = useCallback(
    async (p = 1) => {
      setLoading(true)
      setError(null)
      try {
        const data = await getSongs(p, 10)
        setSongs(data.data)
        setTotal(data.total)
        setPage(data.page)
      } catch (err) {
        setError('Failed to load songs. Is the backend running?')
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const fetchAllSongs = useCallback(async () => {
    try {
      const data = await getAllSongs()
      setAllSongs(data)
    } catch (err) {
      console.error('Failed to fetch all songs', err)
    }
  }, [])

  useEffect(() => {
    fetchSongs(1)
    fetchAllSongs()
  }, [fetchSongs, fetchAllSongs])

  const handlePageChange = (p) => {
    if (searchResult !== null) return
    fetchSongs(p)
  }

  const handleSort = (col) => {
    const newDir = sortCol === col && sortDir === 'asc' ? 'desc' : 'asc'
    setSortCol(col)
    setSortDir(newDir)

    const displaySongs = searchResult !== null ? [...searchResult] : [...songs]
    displaySongs.sort((a, b) => {
      const av = a[col]
      const bv = b[col]
      if (typeof av === 'string') {
        return newDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      }
      return newDir === 'asc' ? av - bv : bv - av
    })

    if (searchResult !== null) {
      setSearchResult(displaySongs)
    } else {
      setSongs(displaySongs)
    }
  }

  const handleSearch = async (title) => {
    setSearchTitle(title)
    if (!title.trim()) {
      setSearchResult(null)
      fetchSongs(1)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const results = await searchSong(title)
      setSearchResult(results)
    } catch (err) {
      setError('Search failed.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRating = async (index, rating) => {
    try {
      const updated = await rateSong(index, rating)
      // Update in local songs list
      setSongs((prev) =>
        prev.map((s) => (s.index === index ? { ...s, star_rating: updated.star_rating } : s))
      )
      if (searchResult !== null) {
        setSearchResult((prev) =>
          prev.map((s) => (s.index === index ? { ...s, star_rating: updated.star_rating } : s))
        )
      }
      setAllSongs((prev) =>
        prev.map((s) => (s.index === index ? { ...s, star_rating: updated.star_rating } : s))
      )
    } catch (err) {
      console.error('Failed to update rating', err)
    }
  }

  const handleDownloadCSV = async () => {
    try {
      const data = await getAllSongs()
      if (!data.length) return

      const headers = Object.keys(data[0]).join(',')
      const rows = data.map((song) =>
        Object.values(song)
          .map((v) => (typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v))
          .join(',')
      )
      const csv = [headers, ...rows].join('\n')
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'playlist.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('CSV download failed', err)
    }
  }

  const displaySongs = searchResult !== null ? searchResult : songs
  const displayTotal = searchResult !== null ? searchResult.length : total
  const chartSongs = allSongs.length > 0 ? allSongs : songs

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Songs Playlist Dashboard</h1>
          <span className="header-subtitle">Browse, search, and rate your music library</span>
        </div>
        <button className="btn btn-success" onClick={handleDownloadCSV}>
          Download CSV
        </button>
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        <div className="toolbar">
          <SearchBar onSearch={handleSearch} />
        </div>

        {searchResult !== null && (
          <div className="search-results-banner">
            <span>
              {searchResult.length === 0
                ? `No results for "${searchTitle}"`
                : `${searchResult.length} result${searchResult.length !== 1 ? 's' : ''} for "${searchTitle}"`}
            </span>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchResult(null)
                setSearchTitle('')
                fetchSongs(1)
              }}
            >
              Clear Search
            </button>
          </div>
        )}

        <h2 className="section-heading">Songs</h2>

        {loading ? (
          <div className="loading-overlay">Loading songs...</div>
        ) : (
          <SongsTable
            songs={displaySongs}
            total={displayTotal}
            page={page}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortCol={sortCol}
            sortDir={sortDir}
            onRating={handleRating}
          />
        )}

        <section className="charts-section">
          <h2 className="section-heading">Analytics</h2>
          <div className="charts-grid">
            <DanceabilityScatter songs={chartSongs} />
            <DurationHistogram songs={chartSongs} />
            <AcousticsBarChart songs={chartSongs} />
            <TempoBarChart songs={chartSongs} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
