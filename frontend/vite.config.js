import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // required for Docker (listen on 0.0.0.0)
    proxy: {
      '/api': {
        // BACKEND_URL is injected by docker-compose; falls back to localhost for local dev
        target: process.env.BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
