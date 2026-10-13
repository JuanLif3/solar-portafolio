import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'oxc',
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router)/,
              priority: 20,
            },
            {
              name: 'three-vendor',
              test: /[\\/]node_modules[\\/](three|@react-three|three-stdlib)/,
              priority: 15,
            },
            {
              name: 'charts-vendor',
              test: /[\\/]node_modules[\\/](recharts|d3-|victory-vendor)/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})