import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  resolve: {
    dedupe: ['three'] // Evite les doubles instances de three.js (ex: stats-gl embarque sa propre version)
  },
  build: {
    chunkSizeWarningLimit: 2000 // Fait taire l'avertissement sans casser Three.js
  }
})