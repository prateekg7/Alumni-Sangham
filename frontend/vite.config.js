import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '127.0.0.1',
    /** Use 5174 if 5173 is busy; backend CORS allows any localhost / 127.0.0.1 port in development. */
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
    watch: {
      ignored: ['**/dist/**', '**/public/frames/**'],
    },
  },
  optimizeDeps: {
    entries: ['src/main.jsx'],
    holdUntilCrawlEnd: false,
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'framer-motion',
      'ogl',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-navigation-menu',
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/react-fontawesome',
      '@fortawesome/free-solid-svg-icons',
    ],
    noDiscovery: true,
  },
})
