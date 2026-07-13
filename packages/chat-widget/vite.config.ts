import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  define: {
    __BRAND_URL__: JSON.stringify(
      process.env.VITE_BRAND_URL ??
        (mode === 'development' ? 'http://localhost:3000' : 'https://mindrithm.ai')
    ),
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ForgeChat',
      // fileName callback overrides the default `widget.iife.js` → `widget.js`
      fileName: () => 'widget.js',
      formats: ['iife'],
    },
    minify: true,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // No external deps — everything bundled into single file
      external: [],
      output: {
        inlineDynamicImports: true,
      },
    },
  },
}))
