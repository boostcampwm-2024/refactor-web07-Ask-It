import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: mode === 'production' ? env.VITE_STATIC_URL : '/',
    plugins: [
      TanStackRouterVite(),
      react(),
      visualizer({
        filename: './dist/stats.html',
      }),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_SERVER_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
