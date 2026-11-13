import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_PATH is the folder the site is served from: "/" on its own domain,
// "/portfolio/" on GitHub Pages (set by .github/workflows/deploy.yml).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
})
