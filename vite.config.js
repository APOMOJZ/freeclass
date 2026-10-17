import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is set to the GitHub repo name for GitHub Pages deployment
export default defineConfig({
  plugins: [react()],
  base: '/freeclass/',
})
