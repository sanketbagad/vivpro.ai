import '@testing-library/jest-dom'

// Polyfill ResizeObserver for jsdom (required by recharts ResponsiveContainer)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
