import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      fileName: 'index',
      formats: ['es', 'cjs', 'iife'],
      name: 'CompareStackingOrder',
    },
    minify: false,
  },
  plugins: [dts({ rollupTypes: true })],
  test: {
    environment: 'jsdom',
  },
});
