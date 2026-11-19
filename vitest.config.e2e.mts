import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    // Each test file runs in its own Postgres schema, so files can run in parallel,
    // but tests inside a file share the same app instance and database.
    fileParallelism: true,
    hookTimeout: 60_000,
  },
  resolve: { tsconfigPaths: true },
  plugins: [swc.vite({ module: { type: 'es6' } })],
})
