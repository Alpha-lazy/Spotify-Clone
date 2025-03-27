import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: false,
      interval: 1000,
    },
    hmr: true, // Enable HMR properly instead of disabling it
  },
  build: {
    watch: {
      exclude: ["**/target/**"],
    },
  },
});
