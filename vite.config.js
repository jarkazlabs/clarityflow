import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// WICHTIG: 'clarityflow' durch deinen GitHub-Repository-Namen ersetzen
export default defineConfig({
  plugins: [react()],
  base: '/clarityflow/',
})
