import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY ?? ''),
      'process.env.WATHQ_API_KEY': JSON.stringify(env.WATHQ_API_KEY ?? ''),
      'process.env.APP_URL': JSON.stringify(env.APP_URL ?? ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            // Heavy, leaf-level libs that don't depend on each other or on React directly.
            pdf: ['html2pdf.js'],
            tesseract: ['tesseract.js'],
            git: ['isomorphic-git', '@isomorphic-git/lightning-fs'],
            gun: ['gun'],
            icons: ['lucide-react'],
            motion: ['motion'],
          },
        },
      },
    },
    server: {
      hmr:
        process.env.DISABLE_HMR !== 'true'
          ? { path: '/vite-hmr' }
          : false,
      proxy: {
        '/ws': { target: 'ws://localhost:3000', ws: true },
        '/api': { target: 'http://localhost:3000', changeOrigin: true },
      },
    },
    preview: {
      port: 4173,
    },
  };
});
