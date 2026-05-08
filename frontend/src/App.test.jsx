import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'

// Mock axios to prevent actual HTTP calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          total: 0,
          page: 1,
          limit: 10,
          data: [],
        },
      })
    ),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  },
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText('Songs Playlist Dashboard')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<App />)
    expect(screen.getByText(/loading songs/i)).toBeInTheDocument()
  })
})
