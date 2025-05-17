import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
    },
    historyApiFallback: true 
  }
});
