import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/data': path.resolve(__dirname, 'data'),
      '@/styles': path.resolve(__dirname, 'styles'),
      '@/types': path.resolve(__dirname, 'types'),
    },
  },
})
