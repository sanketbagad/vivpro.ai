import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  const handleSearch = () => {
    onSearch(value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by song title..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="search-input"
        aria-label="Search songs"
      />
      <button onClick={handleSearch} className="btn btn-primary">
        Get Song
      </button>
      {value && (
        <button
          onClick={() => {
            setValue('')
            onSearch('')
          }}
          className="btn btn-secondary"
        >
          Clear
        </button>
      )}
    </div>
  )
}

export default SearchBar
