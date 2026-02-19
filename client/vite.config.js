import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/kitsu': {
        target: 'https://kitsu.io/api/edge',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kitsu/, ''),
        secure: true,
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json'
        }
      }
    }
  }
})
