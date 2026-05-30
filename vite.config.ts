import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'github-pages' ? '/tarot-web/' : '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          icons: ['lucide-react'],
          react: ['react', 'react-dom'],
          three: ['three'],
        },
      },
    },
  },
}));
