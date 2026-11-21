import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: { watch: { usePolling: true, interval: 1000 }, proxy: { '/api': { target: 'http://127.0.0.1:8000', changeOrigin: true }, '/media': { target: 'http://127.0.0.1:8000', changeOrigin: true } } },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
