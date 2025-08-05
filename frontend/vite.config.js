import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  // For local development only
  server: {
    proxy: {
      '/api/chat': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        secure: false,
      }
    },
    fs: {
      strict: false
    }
  }
});
