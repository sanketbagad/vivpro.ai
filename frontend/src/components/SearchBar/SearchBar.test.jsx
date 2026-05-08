import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders input and button', () => {
    render(<SearchBar onSearch={() => {}} />)
    expect(screen.getByPlaceholderText(/search by song title/i)).toBeInTheDocument()
    expect(screen.getByText('Get Song')).toBeInTheDocument()
  })

  it('typing and clicking Get Song calls onSearch with value', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByPlaceholderText(/search by song title/i)
    await user.type(input, '3AM')
    fireEvent.click(screen.getByText('Get Song'))

    expect(onSearch).toHaveBeenCalledWith('3AM')
  })
})
