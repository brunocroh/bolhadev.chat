import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  dts: true,
  format: ['esm'],
  clean: true,
  sourcemap: true,
})
