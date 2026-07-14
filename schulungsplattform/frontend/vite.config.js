import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5273,
    open: true,
    proxy: {
      // Alle /api-Aufrufe an das Flask-Backend (Port 8100) weiterleiten
      '/api': {
        target: 'http://localhost:8100',
        changeOrigin: true,
      },
    },
  },
})
