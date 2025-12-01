import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Finance-Tracker/' // <-- important: match your repo name and case
})
// Run `npm install` in your terminal instead of placing it in this config file.