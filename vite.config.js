import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target:
          process.env.NODE_ENV === 'production'
            ? 'https://fhpe-backend.onrender.com'
            : 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
