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
