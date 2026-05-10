import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ command }) => {
  // VITE_BASE_URL can be overridden at build time (e.g. Docker uses '/')
  // Default for Replit production: '/admin/'  |  Dev server: '/'
  const base = process.env.VITE_BASE_URL ?? (command === 'build' ? '/admin/' : '/');

  return {
    base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  };
});
