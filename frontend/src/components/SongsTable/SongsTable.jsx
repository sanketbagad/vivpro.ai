import StarRating from '../StarRating'

const COLUMNS = [
  { key: 'index', label: '#' },
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'danceability', label: 'Danceability' },
  { key: 'energy', label: 'Energy' },
  { key: 'key', label: 'Key' },
  { key: 'loudness', label: 'Loudness' },
  { key: 'mode', label: 'Mode' },
  { key: 'acousticness', label: 'Acousticness' },
  { key: 'tempo', label: 'Tempo' },
  { key: 'duration_ms', label: 'Duration (ms)' },
  { key: 'num_sections', label: 'Sections' },
  { key: 'num_segments', label: 'Segments' },
  { key: 'star_rating', label: 'Rating' },
]

function SongsTable({
  songs = [],
  total = 0,
  page = 1,
  onPageChange,
  onSort,
  sortCol,
  sortDir,
  onRating,
}) {
  const limit = 10
  const totalPages = Math.ceil(total / limit)

  const renderSortArrow = (key) => {
    if (sortCol !== key) return null
    return sortDir === 'asc' ? ' ▲' : ' ▼'
  }

  const renderPageNumbers = () => {
    const pages = []
    const maxVisible = 7
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let p = start; p <= end; p++) {
      pages.push(
        <button
          key={p}
          className={`page-btn ${p === page ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      )
    }
    return pages
  }

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="songs-table">
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== 'star_rating' && onSort && onSort(col.key)}
                  className={col.key !== 'star_rating' ? 'sortable' : ''}
                >
                  {col.label}
                  {renderSortArrow(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {songs.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="no-data">
                  No songs found.
                </td>
              </tr>
            ) : (
              songs.map((song) => (
                <tr key={song.index}>
                  <td>{song.index}</td>
                  <td className="id-cell" title={song.id}>
                    {song.id.slice(0, 8)}…
                  </td>
                  <td className="title-cell">{song.title}</td>
                  <td>{song.danceability?.toFixed(3)}</td>
                  <td>{song.energy?.toFixed(3)}</td>
                  <td>{song.key}</td>
                  <td>{song.loudness?.toFixed(3)}</td>
                  <td>{song.mode}</td>
                  <td>{song.acousticness?.toFixed(4)}</td>
                  <td>{song.tempo?.toFixed(1)}</td>
                  <td>{song.duration_ms?.toLocaleString()}</td>
                  <td>{song.num_sections}</td>
                  <td>{song.num_segments}</td>
                  <td>
                    <StarRating
                      rating={song.star_rating || 0}
                      onRate={(r) => onRating && onRating(song.index, r)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            &laquo; Prev
          </button>
          {renderPageNumbers()}
          <button
            className="page-btn"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next &raquo;
          </button>
          <span className="page-info">
            Page {page} of {totalPages} ({total} total)
          </span>
        </div>
      )}
    </div>
  )
}

export default SongsTable
