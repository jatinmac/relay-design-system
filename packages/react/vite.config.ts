import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      cssFileName: 'styles',
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es'],
    },
    minify: false,
    rollupOptions: {
      external: [
        'react',
        'react-aria-components',
        'react-dom',
        'react/jsx-runtime',
      ],
    },
    sourcemap: true,
  },
});
