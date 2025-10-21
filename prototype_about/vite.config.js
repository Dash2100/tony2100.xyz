import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    watch: {
      usePolling: true,
    }
  }
})
