import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(
      mode === 'production'
        ? 'https://fhpe-backend.onrender.com'  // Remove /api from base URL
        : ''
    ),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path  // Don't rewrite the path
      }
    }
  }
}))
