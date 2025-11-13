import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'esnext' // ✅ Needed for __publicField fix
  },
  optimizeDeps: {
    include: ['maplibre-gl', '@turf/turf'] // ✅ Pre-bundle these
  },
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        secure: false
      }
    },
    fs: {
      strict: false
    }
  }
})
