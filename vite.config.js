import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite development server configuration.
// The proxy forwards /api requests to the Spring Boot backend at :8080,
// which avoids CORS problems entirely in development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})