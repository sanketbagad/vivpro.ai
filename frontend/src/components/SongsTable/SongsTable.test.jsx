import { render, screen, fireEvent } from '@testing-library/react'
import SongsTable from './SongsTable'

const mockSongs = [
  {
    index: 0,
    id: '5vYA1mW9g2Coh1HUFUSmlb',
    title: '3AM',
    danceability: 0.521,
    energy: 0.673,
    key: 8,
    loudness: -8.685,
    mode: 1,
    acousticness: 0.00573,
    instrumentalness: 0.0,
    liveness: 0.12,
    valence: 0.543,
    tempo: 108.031,
    duration_ms: 225947,
    time_signature: 4,
    num_bars: 100,
    num_sections: 8,
    num_segments: 830,
    class_field: 1,
    star_rating: 0,
  },
  {
    index: 1,
    id: '2klCjJcucgGQysgH170npL',
    title: '4 Walls',
    danceability: 0.735,
    energy: 0.849,
    key: 4,
    loudness: -4.308,
    mode: 0,
    acousticness: 0.212,
    instrumentalness: 0.0000294,
    liveness: 0.0608,
    valence: 0.223,
    tempo: 125.972,
    duration_ms: 207477,
    time_signature: 4,
    num_bars: 107,
    num_sections: 7,
    num_segments: 999,
    class_field: 1,
    star_rating: 2,
  },
]

describe('SongsTable', () => {
  it('renders table with songs data', () => {
    render(
      <SongsTable
        songs={mockSongs}
        total={2}
        page={1}
        onPageChange={() => {}}
        onSort={() => {}}
        sortCol=""
        sortDir="asc"
        onRating={() => {}}
      />
    )
    expect(screen.getByText('3AM')).toBeInTheDocument()
    expect(screen.getByText('4 Walls')).toBeInTheDocument()
  })

  it('clicking column header triggers onSort', () => {
    const onSort = vi.fn()
    render(
      <SongsTable
        songs={mockSongs}
        total={2}
        page={1}
        onPageChange={() => {}}
        onSort={onSort}
        sortCol=""
        sortDir="asc"
        onRating={() => {}}
      />
    )
    fireEvent.click(screen.getByText('Title'))
    expect(onSort).toHaveBeenCalledWith('title')
  })

  it('clicking next page triggers onPageChange', () => {
    const onPageChange = vi.fn()
    render(
      <SongsTable
        songs={mockSongs}
        total={25}
        page={1}
        onPageChange={onPageChange}
        onSort={() => {}}
        sortCol=""
        sortDir="asc"
        onRating={() => {}}
      />
    )
    const nextBtn = screen.getByText(/Next/i)
    fireEvent.click(nextBtn)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })
})
