import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,   // ✅ match Docker
    proxy: {
      '/predict': 'http://backend:8000' // ✅ correct service name
    }
  }
})